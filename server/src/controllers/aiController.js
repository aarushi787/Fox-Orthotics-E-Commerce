const fs = require('fs');
const path = require('path');

// Helper: simple keyword-based fallback matcher (top-level so other handlers can reuse it)
// Supports synonyms and a small fuzzy-match via Levenshtein distance.
const levenshtein = (a = '', b = '') => {
  const al = a.length, bl = b.length;
  if (al === 0) return bl;
  if (bl === 0) return al;
  const v0 = new Array(bl + 1).fill(0).map((_, i) => i);
  const v1 = new Array(bl + 1).fill(0);
  for (let i = 0; i < al; i++) {
    v1[0] = i + 1;
    for (let j = 0; j < bl; j++) {
      const cost = a[i] === b[j] ? 0 : 1;
      v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
    }
    for (let j = 0; j <= bl; j++) v0[j] = v1[j];
  }
  return v1[bl];
};

// synonyms map for common category terms. If a config file exists, we'll merge it in at startup.
let SYNONYMS = {
  laptop: ['laptop', 'notebook', 'ultrabook', 'chromebook'],
  phone: ['phone', 'smartphone', 'mobile'],
  insole: ['insole', 'insert'],
  back: ['back', 'back pain', 'lumbar', 'lumbar support', 'lumbar belt', 'back support', 'back brace', 'lower back', 'sciatica'],
  pain: ['pain', 'ache', 'discomfort'],
};

// Try to load external synonyms file if present (server/config/synonyms.json by default)
try {
  const synonymsPath = process.env.SYNONYMS_JSON_PATH || path.join(__dirname, '..', 'config', 'synonyms.json');
  if (fs.existsSync(synonymsPath)) {
    const raw = fs.readFileSync(synonymsPath, 'utf8');
    const external = JSON.parse(raw);
    // merge: add new keys or append unique synonyms to existing keys
    for (const k of Object.keys(external)) {
      const vals = Array.isArray(external[k]) ? external[k].map(s => normalize(s)) : [];
      if (!SYNONYMS[k]) SYNONYMS[k] = [];
      for (const v of vals) if (!SYNONYMS[k].includes(v)) SYNONYMS[k].push(v);
    }
    console.log('[AI] Loaded synonyms from', synonymsPath);
  }
} catch (e) {
  console.warn('[AI] Failed to load external synonyms file:', e && e.message);
}

// Try to load Fuse.js for improved fuzzy/weighted matching
let Fuse = null;
try {
  // require at runtime so server still works if fuse.js is not installed
  // eslint-disable-next-line global-require
  Fuse = require('fuse.js');
  console.log('[AI] fuse.js loaded for improved matching');
} catch (e) {
  console.warn('[AI] fuse.js not available — using internal matcher');
}

const normalize = (s = '') => (s || '').toString().toLowerCase();

const localFallback = (q, products) => {
  const tokens = (q || "").toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  if (tokens.length === 0) return { assistantResponse: "", recommendedSkus: [] };
  const scores = products.map((p) => {
    const hay = (`${p.name} ${p.description} ${p.category} ${(p.features || []).join(" ")}`).toLowerCase();
    let score = 0;

    tokens.forEach((t) => {
      // direct include
      if (hay.includes(t)) score += 3;
      // synonym match
      const syns = SYNONYMS[t] || [];
      syns.forEach(s => { if (hay.includes(s)) score += 3; });
      // fuzzy match: check each word in hay
      const words = hay.split(/[^a-z0-9]+/).filter(Boolean);
      for (const w of words) {
        const dist = levenshtein(t, w);
        const maxLen = Math.max(t.length, w.length);
        if (maxLen > 0 && dist <= Math.max(1, Math.floor(maxLen * 0.25))) {
          score += 1;
        }
      }
      // plural handling
      if (hay.includes(t.replace(/s$/, ""))) score += 1;
    });

    return { sku: p.sku, score };
  });

  const ranked = scores.filter(s => s.score > 0).sort((a, b) => b.score - a.score);
  const recommendedSkus = ranked.slice(0, 6).map(r => r.sku);

  const assistantResponse = recommendedSkus.length
    ? `Based on your query, here are recommended products: ${recommendedSkus.join(", ")}.` 
    : `I couldn't find exact matches in our catalog. Try a different description or check filters.`;

  return { assistantResponse, recommendedSkus };
};

const getAIRecommendations = async (req, res) => {
  const { query, products: simplifiedProducts } = req.body || {};
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!query || !query.trim()) {
    return res.status(400).json({ message: "Please enter your query." });
  }

  // Ensure we have a products array. If client didn't send one or it's invalid,
  // attempt to load `products.json` from configured path.
  let productsList = [];
  if (Array.isArray(simplifiedProducts)) {
    productsList = simplifiedProducts;
  } else {
    const productsPath = process.env.PRODUCTS_JSON_PATH || path.join(__dirname, '..', '..', '..', 'products.json');
    try {
      if (fs.existsSync(productsPath)) {
        const raw = fs.readFileSync(productsPath, 'utf8');
        const allProducts = JSON.parse(raw);
        productsList = (allProducts || []).map(p => ({ sku: p.sku, name: p.name, description: p.description, category: p.category, features: p.features || [] }));
      } else {
        console.warn('[AI] products.json not found at', productsPath);
      }
    } catch (e) {
      console.error('[AI] failed to load products.json:', e);
    }
  }

  // Log incoming request summary to help debugging
  try {
    const prodCount = Array.isArray(simplifiedProducts) ? simplifiedProducts.length : 0;
    console.log(`[AI] Request query="${query}" products=${prodCount} usingGemini=${Boolean(API_KEY)}`);
  } catch (e) {
    // ignore logging errors
  }

  // If there's no API key or the external SDK is not installed, use local fallback
  if (!API_KEY) {
    console.warn("GEMINI_API_KEY not set — using local fallback recommendations.");
    try {
        // If Fuse is available and we have a product list, use it for better ranking
        if (Fuse && Array.isArray(productsList) && productsList.length > 0) {
          try {
            const fuse = new Fuse(productsList, {
              keys: [
                { name: 'name', weight: 0.45 },
                { name: 'description', weight: 0.3 },
                { name: 'category', weight: 0.15 },
                { name: 'features', weight: 0.1 },
              ],
              includeScore: true,
              threshold: 0.45,
            });
            const results = fuse.search(query);
            const recommendedSkus = results.slice(0, 6).map(r => r.item.sku);
            const assistantResponse = recommendedSkus.length
              ? `Based on your query, here are recommended products: ${recommendedSkus.join(', ')}.`
              : `I couldn't find exact matches in our catalog. Try a different description or check filters.`;
            return res.json({ assistantResponse, recommendedSkus });
          } catch (e) {
            console.warn('[AI] fuse search failed, falling back to local matcher:', e && e.message);
          }
        }

        const json = localFallback(query, productsList || []);
        return res.json(json);
    } catch (e) {
      console.error("Local fallback failed:", e);
      return res.status(500).json({ message: "Something went wrong while finding products. Please try again." });
    }
  }

  // Try to use external AI SDK if available; if it fails, fallback gracefully
  try {
    const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/genai");
    const MODEL_NAME = "gemini-1.0-pro";

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
      response_mime_type: "application/json",
    };

    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];

    const systemInstruction = `You are an expert AI assistant for 'Fox Orthotics Industries', a company specializing in orthopedic products. Your goal is to help users find the perfect product based on a single descriptive sentence. Analyze the meaning, infer needs, and recommend suitable products from the provided list.

Business rules:
- Prices include 5% GST.
- Minimum order: 50 pieces.
- Only recommend products priced between ₹0 and ₹2000.
- Do NOT use or mention material type as a filter.
- Payments are processed securely via Razorpay.

Your response must be a JSON object with the following schema:
{
  "assistantResponse": "<A helpful, friendly, and brief explanation of the recommended products.>",
  "recommendedSkus": ["<SKU1>", "<SKU2>"]
}

Analyze the user's query and the product list to provide the best recommendations. Only recommend SKUs from the provided list. If no products match, return an empty 'recommendedSkus' array.`;

    const parts = [
      { text: systemInstruction },
      { text: `User Query: "${query}"\nProduct List: ${JSON.stringify(simplifiedProducts)}` },
    ];

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
    });

    const rawText = result.response.text();
    try {
      const parsedJson = JSON.parse(rawText);
      return res.json(parsedJson);
    } catch (parseErr) {
      console.warn("AI returned non-json response, falling back to local matcher. Response text:", rawText);
      const fallback = localFallback(query, simplifiedProducts || []);
      return res.json(fallback);
    }

  } catch (e) {
    console.error("AI SDK call failed, using local fallback:", e);
    try {
      const json = localFallback(query, productsList || []);
      return res.json(json);
    } catch (e2) {
      console.error("Local fallback also failed:", e2);
      const body = { message: "Something went wrong while finding products. Please try again." };
      if (process.env.NODE_ENV !== 'production') body.details = (e2 && e2.message) || String(e2);
      return res.status(500).json(body);
    }
  }
};

// New handler: recommend by category server-side. Reads products.json from repo root,
// filters by category (case-insensitive), and then runs the same recommendation logic.
const getAIRecommendationsByCategory = async (req, res) => {
  const category = (req.params.category || "").toLowerCase();
  if (!category) return res.status(400).json({ message: "Category is required." });

  // locate products.json at repo root (server is in server/)
  const productsPath = process.env.PRODUCTS_JSON_PATH || path.join(__dirname, '..', '..', '..', 'products.json');
  if (!fs.existsSync(productsPath)) {
    return res.status(500).json({ message: `Products file not found at ${productsPath}` });
  }

  let allProducts;
  try {
    const raw = fs.readFileSync(productsPath, 'utf8');
    allProducts = JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read products.json:', e);
    return res.status(500).json({ message: 'Failed to read products file.' });
  }

  const filtered = allProducts.filter(p => {
    const cat = (p.category || '').toLowerCase();
    const hay = `${p.name} ${p.description} ${p.category} ${(p.features||[]).join(' ')}`.toLowerCase();
    return cat.includes(category) || hay.includes(category);
  });

  const simplified = filtered.map(p => ({
    sku: p.sku,
    name: p.name,
    description: p.description,
    category: p.category,
    features: p.features || [],
  }));

  // Build a default query that mentions the category
  const query = `Looking for ${req.params.category}`;
  const API_KEY = process.env.GEMINI_API_KEY;

  // If no API key, use the local fallback directly
  if (!API_KEY) {
    try {
      const json = localFallback(query, simplified);
      return res.json(json);
    } catch (e) {
      console.error('Local fallback failed for category:', e);
      return res.status(500).json({ message: 'Something went wrong while finding products. Please try again.' });
    }
  }

  // Otherwise attempt external AI (same pattern as getAIRecommendations)
  try {
    const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/genai");
    const MODEL_NAME = "gemini-1.0-pro";

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
      response_mime_type: "application/json",
    };

    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];

    const systemInstruction = `You are an expert AI assistant for 'Fox Orthotics Industries', a company specializing in orthopedic products. Your goal is to help users find the perfect product based on a single descriptive sentence. Analyze the meaning, infer needs, and recommend suitable products from the provided list.

Business rules:
- Prices include 5% GST.
- Minimum order: 50 pieces.
- Only recommend products priced between ₹0 and ₹2000.
- Do NOT use or mention material type as a filter.
- Payments are processed securely via Razorpay.

Your response must be a JSON object with the following schema:
{
  "assistantResponse": "<A helpful, friendly, and brief explanation of the recommended products.>",
  "recommendedSkus": ["<SKU1>", "<SKU2>"]
}

Analyze the user's query and the product list to provide the best recommendations. Only recommend SKUs from the provided list. If no products match, return an empty 'recommendedSkus' array.`;

    const parts = [
      { text: systemInstruction },
      { text: `User Query: "${query}"\nProduct List: ${JSON.stringify(simplified)}` },
    ];

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
    });

    const rawText = result.response.text();
    try {
      const parsedJson = JSON.parse(rawText);
      return res.json(parsedJson);
    } catch (parseErr) {
      console.warn("AI returned non-json response, falling back to local matcher. Response text:", rawText);
      const fallback = localFallback(query, simplified || []);
      return res.json(fallback);
    }

  } catch (e) {
    console.error("AI SDK call failed for category, using local fallback:", e);
    try {
      const json = localFallback(query, simplified || []);
      return res.json(json);
    } catch (e2) {
      console.error("Local fallback also failed:", e2);
      return res.status(500).json({ message: "Something went wrong while finding products. Please try again." });
    }
  }
};

// Admin: update synonyms file and in-memory SYNONYMS mapping
const setSynonyms = async (req, res) => {
  const body = req.body;
  if (!body || typeof body !== 'object') return res.status(400).json({ message: 'Invalid body. Expecting JSON object of synonyms.' });
  const synonymsPath = process.env.SYNONYMS_JSON_PATH || path.join(__dirname, '..', 'config', 'synonyms.json');
  try {
    fs.writeFileSync(synonymsPath, JSON.stringify(body, null, 2), 'utf8');
    // merge into in-memory SYNONYMS
    for (const k of Object.keys(body)) {
      const vals = Array.isArray(body[k]) ? body[k].map(s => normalize(s)) : [];
      if (!SYNONYMS[k]) SYNONYMS[k] = [];
      for (const v of vals) if (!SYNONYMS[k].includes(v)) SYNONYMS[k].push(v);
    }
    console.log('[AI] Updated synonyms file at', synonymsPath);
    return res.json({ success: true });
  } catch (e) {
    console.error('Failed to write synonyms file:', e);
    return res.status(500).json({ message: 'Failed to write synonyms file.', details: (e && e.message) || String(e) });
  }
};

module.exports = {
  getAIRecommendations,
  getAIRecommendationsByCategory,
  setSynonyms,
};


// Node script to POST a "laptop" query to /api/ai/recommend with laptop products
// Usage: node scripts/batch_ai_laptops.js [--query=laptop] [--server=http://localhost:5000/api/ai/recommend] [--out=./ai-results/laptops.json]

const fs = require('fs');
const path = require('path');
const fetch = global.fetch || require('node-fetch');

const argv = require('minimist')(process.argv.slice(2));
const query = argv.query || 'laptop';
const serverUrl = argv.server || 'http://localhost:5000/api/ai/recommend';
const out = argv.out || path.join('.', 'ai-results', 'laptops_recommendation.json');

(async () => {
  try {
    const productsPath = path.join(__dirname, '..', 'products.json');
    if (!fs.existsSync(productsPath)) throw new Error(`products.json not found at ${productsPath}`);
    const raw = fs.readFileSync(productsPath, 'utf8');
    const allProducts = JSON.parse(raw);

    const k = query.replace(/[^a-z0-9]/ig, ' ').split(/\s+/).filter(Boolean)[0].toLowerCase();
    const filtered = allProducts.filter(p => {
      const hay = `${p.name} ${p.description} ${p.category} ${(p.features||[]).join(' ')}`.toLowerCase();
      return hay.includes(k);
    });

    // Send simplified products to reduce payload size (match frontend shape)
    const makeSimple = (p) => ({
      sku: p.sku,
      name: p.name,
      description: p.description,
      category: p.category,
      features: p.features || [],
    });

    const productsToSend = (filtered.length ? filtered : allProducts).map(makeSimple);
    const body = { query, products: productsToSend };

    // ensure output dir
    const outDir = path.dirname(out);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    console.log(`Posting ${body.products.length} products to ${serverUrl} with query '${query}'`);

    const res = await fetch(serverUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Server responded ${res.status}: ${txt}`);
    }

    const json = await res.json();
    fs.writeFileSync(out, JSON.stringify(json, null, 2), 'utf8');
    console.log(`Saved response to ${out}`);
    console.log('assistantResponse:', json.assistantResponse);
  } catch (e) {
    console.error('Error:', e.message || e);
    process.exit(1);
  }
})();

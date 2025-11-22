const fs = require('fs');
const path = require('path');

// Returns list of image URLs for a given product folder name
const getProductImages = async (req, res) => {
  try {
    const productName = req.params.productName;
    if (!productName) return res.status(400).json({ message: 'productName is required' });

    // images directory root (configurable)
    const imagesRoot = process.env.IMAGES_DIR_PATH || path.join(__dirname, '..', '..', 'images');

    let productDir = path.join(imagesRoot, productName);
    // Debug logging to help diagnose 404s during development
    console.log(`[imagesController] imagesRoot=${imagesRoot}`);
    console.log(`[imagesController] requested productName='${productName}' productDirAttempt='${productDir}' exists=${fs.existsSync(productDir)}`);

    // If exact folder name doesn't exist, try to find a close match by normalizing folder names
    if (!fs.existsSync(productDir)) {
      const normalize = (s) => (s || '').toString().toLowerCase().replace(/[^a-z0-9]/g, '');
      const targetNorm = normalize(productName);
      const entries = fs.readdirSync(imagesRoot, { withFileTypes: true }).filter(d => d.isDirectory());
      let found = null;
      for (const dirent of entries) {
        const dirNorm = normalize(dirent.name);
        if (dirNorm === targetNorm) { found = dirent.name; break; }
        // also allow startsWith for partial matches
        if (dirNorm.startsWith(targetNorm) || targetNorm.startsWith(dirNorm)) { found = dirent.name; break; }
      }
      if (found) {
        productDir = path.join(imagesRoot, found);
        console.log(`[imagesController] matched product folder '${found}' for request '${productName}'`);
      }
    }

    if (!fs.existsSync(productDir)) {
      return res.status(404).json({ message: `No images found for product '${productName}'` });
    }

    const files = fs.readdirSync(productDir).filter(f => {
      const lower = f.toLowerCase();
      return lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png') || lower.endsWith('.webp') || lower.endsWith('.gif') || lower.endsWith('.svg');
    });

    // Use the actual folder name that exists on disk for building URLs (handles normalized matching)
    const actualFolderName = path.basename(productDir);
    // Build public URLs assuming server serves /images static from imagesRoot
    const urls = files.map(f => `/images/${encodeURIComponent(actualFolderName)}/${encodeURIComponent(f)}`);

    console.log(`[imagesController] returning ${urls.length} images for folder='${actualFolderName}' (requested='${productName}')`);

    return res.json({ images: urls });
  } catch (e) {
    console.error('Error reading product images:', e && e.stack ? e.stack : e);
    // Include the message and stack in details only during development to aid debugging
    const details = {
      message: e && e.message ? e.message : String(e),
      stack: e && e.stack ? e.stack : undefined,
    };
    return res.status(500).json({ message: 'Failed to read images', details });
  }
};

module.exports = {
  getProductImages,
};

#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');

const normalize = (s) => (s || '').toString().toLowerCase().replace(/[^a-z0-9]/g, '');

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function copyDirFiles(srcDir, destDir) {
  await ensureDir(destDir);
  const items = await fs.readdir(srcDir, { withFileTypes: true });
  for (const it of items) {
    if (it.isFile()) {
      const srcFile = path.join(srcDir, it.name);
      const destFile = path.join(destDir, it.name);
      await fs.copyFile(srcFile, destFile);
      console.log(`Copied ${srcFile} -> ${destFile}`);
    }
  }
}

async function main() {
  const srcArg = process.argv[2];
  if (!srcArg) {
    console.error('Usage: node scripts/import-sample-images.js <sourceImagesDir>');
    process.exit(1);
  }

  const srcRoot = path.resolve(process.cwd(), srcArg);
  const repoRoot = path.resolve(__dirname, '..');
  const imagesRoot = path.join(repoRoot, 'images');

  // Ensure images root exists
  await ensureDir(imagesRoot);

  // Load products.json
  const productsPath = path.join(repoRoot, 'products.json');
  let products = [];
  try {
    const txt = await fs.readFile(productsPath, 'utf8');
    products = JSON.parse(txt);
  } catch (e) {
    console.error('Failed to read products.json:', e.message);
    process.exit(2);
  }

  // Build normalized name -> product name map
  const productMap = new Map();
  for (const p of products) {
    const n = normalize(p.name);
    productMap.set(n, p.name);
    if (p.sku) productMap.set(normalize(p.sku), p.name);
  }

  // Read source entries
  const srcEntries = await fs.readdir(srcRoot, { withFileTypes: true });

  for (const entry of srcEntries) {
    const entryPath = path.join(srcRoot, entry.name);

    if (entry.isDirectory()) {
      // Try exact normalized folder match first
      const key = normalize(entry.name);
      let matchedProduct = productMap.get(key);

      // fallback: startsWith or contains match
      if (!matchedProduct) {
        for (const [k, prodName] of productMap.entries()) {
          if (k.startsWith(key) || key.startsWith(k) || k.includes(key) || key.includes(k)) {
            matchedProduct = prodName;
            break;
          }
        }
      }

      const destFolderName = matchedProduct || entry.name;
      const destDir = path.join(imagesRoot, destFolderName);
      await copyDirFiles(entryPath, destDir);
    } else if (entry.isFile()) {
      // Single files at root - attempt to match by SKU or name token
      const lower = entry.name.toLowerCase();
      let matched = null;
      for (const p of products) {
        if (p.sku && lower.includes(p.sku.toLowerCase())) { matched = p; break; }
      }
      if (!matched) {
        for (const p of products) {
          if (normalize(entry.name).includes(normalize(p.name))) { matched = p; break; }
        }
      }

      const destDir = matched ? path.join(imagesRoot, matched.name) : path.join(imagesRoot, '_uncategorized');
      await ensureDir(destDir);
      await fs.copyFile(path.join(srcRoot, entry.name), path.join(destDir, entry.name));
      console.log(`Copied file ${entry.name} -> ${destDir}`);
    }
  }

  console.log('Import complete. Review the images/ folder for results.');
}

main().catch((err) => {
  console.error('Error during import:', err && err.message ? err.message : String(err));
  process.exit(3);
});

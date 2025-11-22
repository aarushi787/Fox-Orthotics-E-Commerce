#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, '..', 'products.json');
const OUT_FILE = path.join(__dirname, '..', 'sitemap.xml');

const baseUrl = process.env.BASE_URL || 'https://yourdomain.com';

function formatDate(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

try {
  const raw = fs.readFileSync(PRODUCTS_FILE, 'utf8');
  const products = JSON.parse(raw);

  const urls = [];
  // Add homepage
  urls.push({ loc: `${baseUrl}/`, lastmod: formatDate(new Date()), changefreq: 'daily', priority: '1.0' });

  products.forEach(p => {
    // This project uses hash-based routes for product pages (#/product/{id}).
    // Sitemap entries with fragments are included here so search engines
    // that render JavaScript can discover them. If you migrate to clean
    // paths (e.g. /product/123) update BASE_URL accordingly.
    const loc = `${baseUrl}/#/product/${p.id}`;
    urls.push({ loc, lastmod: formatDate(new Date()), changefreq: 'weekly', priority: '0.8' });
  });

  const xml = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];

  urls.forEach(u => {
    xml.push('  <url>');
    xml.push(`    <loc>${u.loc}</loc>`);
    if (u.lastmod) xml.push(`    <lastmod>${u.lastmod}</lastmod>`);
    if (u.changefreq) xml.push(`    <changefreq>${u.changefreq}</changefreq>`);
    if (u.priority) xml.push(`    <priority>${u.priority}</priority>`);
    xml.push('  </url>');
  });

  xml.push('</urlset>');

  fs.writeFileSync(OUT_FILE, xml.join('\n'));
  console.log(`Sitemap written to ${OUT_FILE} (${urls.length} urls)`);
} catch (err) {
  console.error('Failed to generate sitemap:', err);
  process.exit(1);
}

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
  urls.push({ loc: `${baseUrl}/`, lastmod: formatDate(new Date()), changefreq: 'daily', priority: '1.0' });

  // Add category pages (unique categories from products.json)
  const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);
  function slugifyCategory(name) {
    return name.toLowerCase().replace(/ & /g, '-and-').replace(/\s+/g, '-');
  }
  categories.forEach(cat => {
    const slug = slugifyCategory(cat);
    const loc = `${baseUrl}/#/category/${slug}`;
    urls.push({ loc, lastmod: formatDate(new Date()), changefreq: 'weekly', priority: '0.7' });
  });

  // Add product pages
  products.forEach(p => {
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

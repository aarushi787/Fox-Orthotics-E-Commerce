const admin = require('../config/firebase');
const path = require('path');

async function seed() {
  try {
    const db = admin.firestore();
    const products = require('../../../products.json');

    if (!Array.isArray(products)) {
      console.error('products.json is not an array');
      process.exit(1);
    }

    console.log(`Seeding ${products.length} products to Firestore...`);
    const batch = db.batch();
    let ops = 0;

    for (const p of products) {
      const id = p.id ? String(p.id) : undefined;
      const docRef = id ? db.collection('products').doc(id) : db.collection('products').doc();
      const data = { ...p };
      // Normalize fields
      if (p.imageUrls && !p.imageUrl) data.imageUrl = Array.isArray(p.imageUrls) ? p.imageUrls[0] : p.imageUrls;
      data.createdAt = admin.firestore.FieldValue.serverTimestamp();
      data.updatedAt = admin.firestore.FieldValue.serverTimestamp();
      batch.set(docRef, data, { merge: true });
      ops++;

      // Commit in batches of 400
      if (ops >= 400) {
        await batch.commit();
        console.log('Committed 400 writes...');
        ops = 0;
      }
    }

    await batch.commit();
    console.log('Seeding completed.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();

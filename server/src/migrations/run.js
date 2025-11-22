const path = require('path');
const bcrypt = require('bcryptjs');
const admin = require('../config/firebase');
const User = require('../models/User');

async function runFirestoreMigrations() {
    try {
        console.log('Starting Firestore migration and seed...');
        const db = admin.firestore();
        const products = require(path.join(__dirname, '..', '..', '..', 'products.json'));

        if (!Array.isArray(products)) {
            console.error('products.json is not an array');
            process.exit(1);
        }

        console.log(`Seeding ${products.length} products to Firestore...`);
        let batch = db.batch();
        let ops = 0;
        for (const p of products) {
            const id = p.id ? String(p.id) : undefined;
            const docRef = id ? db.collection('products').doc(id) : db.collection('products').doc();
            const data = { ...p };
            if (p.imageUrls && !p.imageUrl) data.imageUrl = Array.isArray(p.imageUrls) ? p.imageUrls[0] : p.imageUrls;
            data.createdAt = admin.firestore.FieldValue.serverTimestamp();
            data.updatedAt = admin.firestore.FieldValue.serverTimestamp();
            batch.set(docRef, data, { merge: true });
            ops++;
            if (ops >= 400) {
                await batch.commit();
                console.log('Committed 400 writes...');
                batch = db.batch();
                ops = 0;
            }
        }
        if (ops > 0) await batch.commit();
        console.log('Product seeding completed.');

        // Ensure default admin user in Firestore
        console.log('Ensuring admin user exists in Firestore...');
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@foxorthotics.local';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        let user = await User.findByEmail(adminEmail);
        if (!user) {
            const hashed = await bcrypt.hash(adminPassword, 10);
            const id = await User.create({ email: adminEmail, password: hashed, firstName: 'Admin', lastName: 'User', role: 'admin' });
            console.log(`Admin user created in Firestore: ${adminEmail} / ${adminPassword} (id: ${id})`);
        } else {
            console.log('Admin user already exists in Firestore:', adminEmail);
        }

        console.log('Firestore migration completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Firestore migration failed:', err);
        process.exit(1);
    }
}

// Always run the Firestore migration flow in this repo (MySQL artifacts have been migrated).
runFirestoreMigrations();

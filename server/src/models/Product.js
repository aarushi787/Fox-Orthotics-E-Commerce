const admin = require('../config/firebase');

const db = admin.firestore();

class Product {
    static collection() {
        return db.collection('products');
    }

    static async findAll(category) {
        let q = Product.collection();
        if (category) q = q.where('category', '==', category);
        const snap = await q.get();
        const results = [];
        snap.forEach(doc => {
            const data = doc.data();
            results.push({ id: doc.id, ...data });
        });
        return results;
    }

    static async findById(id) {
        const doc = await Product.collection().doc(id).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() };
    }

    static async create(productData) {
        const now = admin.firestore.FieldValue.serverTimestamp();
        const data = { ...productData, createdAt: now, updatedAt: now };
        const ref = await Product.collection().add(data);
        return ref.id;
    }

    static async update(id, productData) {
        const ref = Product.collection().doc(id);
        const doc = await ref.get();
        if (!doc.exists) return 0;
        const now = admin.firestore.FieldValue.serverTimestamp();
        await ref.update({ ...productData, updatedAt: now });
        return 1;
    }

    static async delete(id) {
        const ref = Product.collection().doc(id);
        const doc = await ref.get();
        if (!doc.exists) return 0;
        await ref.delete();
        return 1;
    }

    static async updateRating(productId) {
        const reviewsSnap = await db.collection('reviews').where('productId', '==', productId).get();
        let total = 0;
        let count = 0;
        reviewsSnap.forEach(r => {
            const d = r.data();
            if (typeof d.rating === 'number') {
                total += d.rating;
                count += 1;
            }
        });
        const avg = count === 0 ? 0 : total / count;
        const ref = Product.collection().doc(productId);
        await ref.update({ rating: avg, reviewCount: count, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    }
}

module.exports = Product;

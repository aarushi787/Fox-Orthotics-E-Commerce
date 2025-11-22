const admin = require('../config/firebase');
const User = require('./User');

const db = admin.firestore();

class Review {
    static collection() {
        return db.collection('reviews');
    }

    static async create(reviewData) {
        const { userId, productId, rating, title, comment } = reviewData;
        const now = admin.firestore.FieldValue.serverTimestamp();
        const data = { userId, productId, rating, title, comment, helpfulCount: 0, createdAt: now, updatedAt: now };
        const ref = await Review.collection().add(data);
        return ref.id;
    }

    static async findById(id) {
        const doc = await Review.collection().doc(id).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() };
    }

    static async findByProductId(productId) {
        const snap = await Review.collection().where('productId', '==', productId).orderBy('createdAt', 'desc').get();
        const results = [];
        for (const doc of snap.docs) {
            const data = doc.data();
            // try to enrich with user first/last name if present
            let firstName = null;
            let lastName = null;
            if (data.userId) {
                const u = await User.findById(data.userId);
                if (u) {
                    firstName = u.firstName || u.first_name || null;
                    lastName = u.lastName || u.last_name || null;
                }
            }
            results.push({ id: doc.id, ...data, firstName, lastName });
        }
        return results;
    }

    static async delete(id) {
        const ref = Review.collection().doc(id);
        const doc = await ref.get();
        if (!doc.exists) return 0;
        await ref.delete();
        return 1;
    }

    static async incrementHelpful(id) {
        const ref = Review.collection().doc(id);
        const doc = await ref.get();
        if (!doc.exists) return 0;
        await ref.update({ helpfulCount: admin.firestore.FieldValue.increment(1) });
        return 1;
    }
}

module.exports = Review;

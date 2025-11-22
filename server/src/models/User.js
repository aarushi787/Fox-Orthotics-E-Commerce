const admin = require('../config/firebase');

const db = admin.firestore();

class User {
    static collection() {
        return db.collection('users');
    }

    static async create(userData) {
        const now = admin.firestore.FieldValue.serverTimestamp();
        const data = { ...userData, createdAt: now, updatedAt: now };
        const ref = await User.collection().add(data);
        return ref.id;
    }

    static async findByEmail(email) {
        const snap = await User.collection().where('email', '==', email).limit(1).get();
        if (snap.empty) return null;
        const doc = snap.docs[0];
        return { id: doc.id, ...doc.data() };
    }

    static async findById(id) {
        const doc = await User.collection().doc(id).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() };
    }

    static async update(id, userData) {
        const ref = User.collection().doc(id);
        const doc = await ref.get();
        if (!doc.exists) return 0;
        await ref.update({ ...userData, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
        return 1;
    }
}

module.exports = User;

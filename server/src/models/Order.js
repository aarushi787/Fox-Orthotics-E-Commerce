const admin = require('../config/firebase');
const Product = require('./Product');

const db = admin.firestore();

class Order {
    static collection() {
        return db.collection('orders');
    }

    // items is expected to be array of { productId, quantity, price }
    static async create(orderData, items) {
        const now = admin.firestore.FieldValue.serverTimestamp();
        const data = { ...orderData, items: items || [], createdAt: now, updatedAt: now, status: 'pending' };
        const ref = await Order.collection().add(data);
        return ref.id;
    }

    static async findByUserId(userId) {
        const snap = await Order.collection().where('userId', '==', userId).orderBy('createdAt', 'desc').get();
        const results = [];
        snap.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
        return results;
    }

    static async findById(orderId) {
        const doc = await Order.collection().doc(orderId).get();
        if (!doc.exists) return null;
        const order = { id: doc.id, ...doc.data() };

        // enrich items with product data (name, sku, imageUrl)
        if (Array.isArray(order.items) && order.items.length) {
            const enriched = [];
            for (const it of order.items) {
                const prod = await Product.findById(it.productId);
                enriched.push({ ...it, product: prod ? { id: prod.id, name: prod.name, sku: prod.sku, imageUrl: prod.imageUrl, price: prod.price } : null });
            }
            order.items = enriched;
        }

        return order;
    }

    static async updateStatus(orderId, status) {
        const ref = Order.collection().doc(orderId);
        const doc = await ref.get();
        if (!doc.exists) return 0;
        await ref.update({ status, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
        return 1;
    }
}

module.exports = Order;

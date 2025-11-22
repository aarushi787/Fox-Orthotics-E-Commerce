const razorpay = require('../config/razorpay');
// Create Razorpay order for payment
exports.createRazorpayOrder = async (req, res, next) => {
    try {
        const { amount, currency = 'INR', receipt } = req.body;
        if (!amount) {
            return res.status(400).json({ message: 'Amount is required.' });
        }
        const options = {
            amount: Math.round(amount * 100), // Razorpay expects paise
            currency,
            receipt: receipt || `rcpt_${Date.now()}`,
        };
        const order = await razorpay.orders.create(options);
        res.status(201).json(order);
    } catch (error) {
        next(error);
    }
};
const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res, next) => {
    const userId = req.user.id;
    const { items, shippingCost, shippingAddress, notes } = req.body;

    if (!items || items.length === 0 || !shippingAddress) {
        return res.status(400).json({ message: 'Missing required order information.' });
    }

    try {
        // Simple validation: check if products exist and prices match
        let subtotal = 0;
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(400).json({ message: `Product with ID ${item.productId} not found.` });
            }
            // Enforce minimum order quantity (moq) of 50 per product
            if (item.quantity < 50) {
                return res.status(400).json({ message: `Minimum order quantity for ${product.name} is 50 pieces.` });
            }
            subtotal += product.price * item.quantity;
        }
        // Apply 5% GST
        const gst = +(subtotal * 0.05).toFixed(2);
        const total = +(subtotal + gst + (shippingCost || 0)).toFixed(2);
        const orderData = { userId, total, tax: gst, shippingCost, shippingAddress, notes };
        const orderId = await Order.create(orderData, items);
        const newOrder = await Order.findById(orderId);
        res.status(201).json(newOrder);
    } catch (error) {
        next(error);
    }
};

exports.getUserOrders = async (req, res, next) => {
    try {
        const orders = await Order.findByUserId(req.user.id);
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};

exports.getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }
        // Ensure the user owns the order or is an admin
        if (order.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: You cannot access this order.' });
        }
        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
};

exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ message: 'Status is required.' });
        }
        const affectedRows = await Order.updateStatus(req.params.id, status);
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Order not found.' });
        }
        const updatedOrder = await Order.findById(req.params.id);
        res.status(200).json(updatedOrder);
    } catch (error) {
        next(error);
    }
};

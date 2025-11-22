
const express = require('express');
const auth = require('../middleware/auth');
const {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    createRazorpayOrder
} = require('../controllers/orderController');

const router = express.Router();

// Razorpay payment order endpoint
router.post('/razorpay-order', auth(), createRazorpayOrder);
router.post('/', auth(), createOrder);
router.get('/', auth(), getUserOrders);
router.get('/:id', auth(), getOrderById);
router.put('/:id/status', auth('admin'), updateOrderStatus);

module.exports = router;

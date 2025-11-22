const express = require('express');
const {
    createReview,
    getReviewsForProduct,
    deleteReview,
    markReviewHelpful
} = require('../controllers/reviewController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth(), createReview);
router.get('/product/:productId', getReviewsForProduct);
router.delete('/:id', auth(), deleteReview);
router.post('/:id/helpful', markReviewHelpful);


module.exports = router;

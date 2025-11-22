const Review = require('../models/Review');
const Product = require('../models/Product');

exports.createReview = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId, rating, title, comment } = req.body;
        
        if (!productId || !rating || !title || !comment) {
            return res.status(400).json({ message: 'All fields are required for a review.' });
        }

        const reviewId = await Review.create({ userId, productId, rating, title, comment });
        
        // Update product's average rating
        await Product.updateRating(productId);

        const newReview = await Review.findById(reviewId);
        res.status(201).json(newReview);
    } catch (error) {
        next(error);
    }
};

exports.getReviewsForProduct = async (req, res, next) => {
    try {
        const reviews = await Review.findByProductId(req.params.productId);
        res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
};

exports.deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found.' });
        }

        // Check if user is owner or admin
        if (review.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to delete this review.' });
        }
        
        await Review.delete(req.params.id);

        // Update product's average rating after deletion
        await Product.updateRating(review.productId);
        
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

exports.markReviewHelpful = async (req, res, next) => {
    try {
        const affectedRows = await Review.incrementHelpful(req.params.id);
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Review not found.' });
        }
        res.status(200).json({ message: 'Review marked as helpful.' });
    } catch (error) {
        next(error);
    }
};

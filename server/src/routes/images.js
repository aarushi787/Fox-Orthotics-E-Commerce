const express = require('express');
const { getProductImages } = require('../controllers/imagesController');

const router = express.Router();

// GET /api/images/:productName
router.get('/:productName', getProductImages);

module.exports = router;

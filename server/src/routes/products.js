const express = require('express');
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', auth('admin'), createProduct);
router.put('/:id', auth('admin'), updateProduct);
router.delete('/:id', auth('admin'), deleteProduct);

module.exports = router;

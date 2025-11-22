const Product = require('../models/Product');

exports.getAllProducts = async (req, res, next) => {
    try {
        const { category } = req.query;
        const products = await Product.findAll(category);
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

exports.getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

exports.createProduct = async (req, res, next) => {
    try {
        const productId = await Product.create(req.body);
        const newProduct = await Product.findById(productId);
        res.status(201).json(newProduct);
    } catch (error) {
        next(error);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        const affectedRows = await Product.update(req.params.id, req.body);
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const updatedProduct = await Product.findById(req.params.id);
        res.status(200).json(updatedProduct);
    } catch (error) {
        next(error);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const affectedRows = await Product.delete(req.params.id);
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

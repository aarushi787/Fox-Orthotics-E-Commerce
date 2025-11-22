require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const aiRoutes = require('./routes/ai');
const imagesRoutes = require('./routes/images');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);
// Serve static images directory (configurable via IMAGES_DIR_PATH env var)
const path = require('path');
const imagesRoot = process.env.IMAGES_DIR_PATH || path.join(__dirname, '..', '..', 'images');
app.use('/images', express.static(imagesRoot));

// Images API
app.use('/api/images', imagesRoutes);

// Swagger UI (API docs)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Central Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

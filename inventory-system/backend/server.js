const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/spares', require('./routes/spareRoutes'));
app.use('/api/machines', require('./routes/machineRoutes'));
app.use('/api/suppliers', require('./routes/supplierRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// Serve Frontend Static Files
app.use(express.static(path.join(__dirname, '../frontend')));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use(require('./middleware/errorMiddleware').errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const dataRoutes = require('./src/routes/dataRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 1. ADD THIS: Root Health Check Route
app.get('/', (req, res) => {
  res.json({
    status: "Success",
    message: "Tenachin API is live",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "production"
  });
});

// 2. ADD THIS: Specific API Status Route
app.get('/api/status', (req, res) => {
  res.json({ service: "Tenachin Backend", online: true });
});

// Existing API Routes
app.use('/api', dataRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Tenachin Backend running on port ${PORT}`);
});
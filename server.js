const express = require('express');
const cors = require('cors');
require('dotenv').config();

const dataRoutes = require('./src/routes/dataRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', dataRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Tenachin Backend running on port ${PORT}`);
});
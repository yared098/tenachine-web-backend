const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit'); 
require('dotenv').config();

const dataRoutes = require('./src/routes/dataRoutes');

const app = express();

// --- 1. PROXY CONFIGURATION ---
app.set('trust proxy', 1);

// --- 2. CORS CONFIGURATION ---
const allowedOrigins = [
  "http://localhost:3000",
  "https://tenachin.org",
  "https://www.tenachin.org"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS policy: Origin not allowed"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  // This automatically handles the "OPTIONS" preflight for all routes
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply CORS globally - this handles both regular and OPTIONS requests
app.use(cors(corsOptions));

// --- 3. MIDDLEWARE ---
app.use(express.json({ limit: '10kb' }));

// --- 4. RATE LIMITING ---
const generalLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { error: "Too many requests." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', generalLimit);

const authLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100, 
  message: { error: "Too many login attempts." },
});
app.use('/api/auth', authLimit);

// --- DEBUG LOGGER ---
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// --- 5. BASE ROUTES ---
app.get('/', (req, res) => {
  res.json({ status: "Success", message: "Tenachin API is live" });
});

app.get('/api/status', (req, res) => {
  res.json({ service: "Tenachin Backend", online: true });
});

// --- 6. FEATURE ROUTES ---
app.use('/api', dataRoutes);

// --- 7. ERROR HANDLING ---
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.message);
  res.status(500).json({ success: false, error: "Internal Server Error" });
});

// --- 8. SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Tenachin Backend Running on port ${PORT}`);
});
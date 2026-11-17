import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import itemsRouter from './routes/items.js';
import adminRouter from './routes/admin.js';
import authRouter from './routes/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded photos statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Campus Lost & Found API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/items', itemsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/auth', authRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Start listening
app.listen(PORT, () => {
  console.log(`\n🚀 Campus Lost & Found API running at: http://localhost:${PORT}`);
  console.log(`📁 Uploads served from: ${UPLOADS_DIR}\n`);
});

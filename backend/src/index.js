import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import roadmapRoutes from './routes/roadmap.routes.js';

const app = express();
const PORT = process.env.PORT ?? 5000;

// CORS first – in dev allow any origin so browser from 3000 can call this server
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});
app.use(express.json());

app.use('/api', (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/app').catch((err) => {
  console.warn('MongoDB connection warning:', err.message);
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/roadmap', roadmapRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

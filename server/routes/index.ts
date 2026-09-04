import { Router } from 'express';
import authRoutes, { authMiddleware } from './auth';
import productRoutes from './products';
import categoryRoutes from './categories';
import uploadRoutes from './upload';

const router = Router();

// Health check
router.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    env: process.env.COZE_PROJECT_ENV,
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/api/auth', authRoutes);
router.use('/api/products', productRoutes);
router.use('/api/categories', categoryRoutes);

// Protected upload route (requires Bearer token)
router.use('/api/upload', authMiddleware, uploadRoutes);

export default router;

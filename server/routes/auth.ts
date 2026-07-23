import { Router, type Request, type Response, type NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../lib/supabase';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'apex-ball-secret-key-2024';

interface AuthRequest extends Request {
  adminId?: number;
  adminUsername?: string;
}

function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; username: string };
    req.adminId = decoded.id;
    req.adminUsername = decoded.username;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body as { username?: string; password?: string };
    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }

    const db = getDb();
    const { data, error } = await db
      .from('admins')
      .select('id, username, password_hash')
      .eq('username', username)
      .maybeSingle();

    if (error) throw new Error(`Query failed: ${error.message}`);
    if (!data) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const validPassword = await bcrypt.compare(password, data.password_hash);
    if (!validPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { id: data.id, username: data.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      admin: { id: data.id, username: data.username },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current admin info
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    res.json({
      success: true,
      admin: { id: req.adminId, username: req.adminUsername },
    });
  } catch (err) {
    console.error('Get admin info error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export { authMiddleware };
export default router;

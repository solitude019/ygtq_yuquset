import { Router, type Request, type Response } from 'express';
import { getPool, type QueryRows, type DbRow } from '../lib/db';
import { authMiddleware } from './auth';

const router = Router();

interface CategoryRow extends DbRow {
  id: number;
  name: string;
  description: string;
  created_at: Date | string;
}

function mapCategory(row: DbRow): CategoryRow {
  return {
    id: Number(row.id),
    name: String(row.name),
    description: String(row.description ?? ''),
    created_at: (row.created_at as Date | string) ?? null,
  };
}

// GET /api/categories - List all categories (public)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query<QueryRows>(
      'SELECT id, name, description, created_at FROM categories ORDER BY name ASC'
    );
    res.json({ success: true, data: rows.map(mapCategory) });
  } catch (err) {
    console.error('Get categories error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/categories - Create category (admin)
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body as { name?: string; description?: string };
    if (!name) {
      res.status(400).json({ error: 'Category name is required' });
      return;
    }

    const pool = getPool();
    const [result] = await pool.execute(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [String(name), description ? String(description) : '']
    );

    const insertId = (result as { insertId: number }).insertId;
    const [rows] = await pool.query<QueryRows>(
      'SELECT id, name, description, created_at FROM categories WHERE id = ? LIMIT 1',
      [insertId]
    );

    res.status(201).json({ success: true, data: mapCategory(rows[0]) });
  } catch (err) {
    console.error('Create category error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/categories/:id - Update category (admin)
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const setClauses: string[] = [];
    const params: Array<string | number> = [];

    if (req.body.name !== undefined) {
      setClauses.push('name = ?');
      params.push(String(req.body.name));
    }
    if (req.body.description !== undefined) {
      setClauses.push('description = ?');
      params.push(String(req.body.description));
    }

    if (setClauses.length === 0) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }

    params.push(Number(id));
    const pool = getPool();
    const [result] = await pool.execute(
      `UPDATE categories SET ${setClauses.join(', ')} WHERE id = ?`,
      params
    );

    if ((result as { affectedRows: number }).affectedRows === 0) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    const [rows] = await pool.query<QueryRows>(
      'SELECT id, name, description, created_at FROM categories WHERE id = ? LIMIT 1',
      [Number(id)]
    );

    res.json({ success: true, data: mapCategory(rows[0]) });
  } catch (err) {
    console.error('Update category error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/categories/:id - Delete category (admin)
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    // Check if any products reference this category
    const [countRows] = await pool.query<QueryRows>(
      'SELECT COUNT(*) AS cnt FROM products WHERE category_id = ?',
      [Number(id)]
    );
    const count = Number(countRows[0]?.cnt ?? 0);
    if (count > 0) {
      res.status(409).json({ error: 'Cannot delete category with associated products' });
      return;
    }

    const [result] = await pool.execute('DELETE FROM categories WHERE id = ?', [Number(id)]);

    if ((result as { affectedRows: number }).affectedRows === 0) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    console.error('Delete category error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

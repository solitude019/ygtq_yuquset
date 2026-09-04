import { Router, type Request, type Response } from 'express';
import { query, execute } from '../lib/db';
import { authMiddleware } from './auth';

const router = Router();

interface CategoryRow {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

// GET /api/categories - List all categories (public)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const rows = await query<CategoryRow[]>(
      'SELECT id, name, description, created_at FROM categories ORDER BY name ASC'
    );
    res.json({ success: true, data: rows });
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

    const result = await execute(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [name, description || '']
    );

    const rows = await query<CategoryRow[]>(
      'SELECT id, name, description, created_at FROM categories WHERE id = ? LIMIT 1',
      [result.insertId]
    );

    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('Create category error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/categories/:id - Update category (admin)
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sets: string[] = [];
    const params: unknown[] = [];
    if (req.body.name !== undefined) {
      sets.push('name = ?');
      params.push(req.body.name);
    }
    if (req.body.description !== undefined) {
      sets.push('description = ?');
      params.push(req.body.description);
    }

    if (sets.length === 0) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }
    params.push(Number(id));

    await execute(`UPDATE categories SET ${sets.join(', ')} WHERE id = ?`, params);

    const rows = await query<CategoryRow[]>(
      'SELECT id, name, description, created_at FROM categories WHERE id = ? LIMIT 1',
      [Number(id)]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('Update category error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/categories/:id - Delete category (admin)
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Detach products from this category, then remove the category.
    await execute('UPDATE products SET category_id = NULL WHERE category_id = ?', [Number(id)]);
    await execute('DELETE FROM categories WHERE id = ?', [Number(id)]);
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    console.error('Delete category error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

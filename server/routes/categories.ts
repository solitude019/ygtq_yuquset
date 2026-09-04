import { Router, type Request, type Response } from 'express';
import { getDb } from '../lib/supabase';
import { authMiddleware } from './auth';

const router = Router();

// GET /api/categories - List all categories (public)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const db = getDb();
    const { data, error } = await db
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw new Error(`Query failed: ${error.message}`);
    res.json({ success: true, data: data || [] });
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

    const db = getDb();
    const { data, error } = await db
      .from('categories')
      .insert({ name, description: description || '' })
      .select()
      .single();

    if (error) throw new Error(`Insert failed: ${error.message}`);
    res.status(201).json({ success: true, data });
  } catch (err) {
    console.error('Create category error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/categories/:id - Update category (admin)
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates: Record<string, string> = {};
    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.description !== undefined) updates.description = req.body.description;

    const db = getDb();
    const { data, error } = await db
      .from('categories')
      .update(updates)
      .eq('id', Number(id))
      .select()
      .maybeSingle();

    if (error) throw new Error(`Update failed: ${error.message}`);
    if (!data) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    res.json({ success: true, data });
  } catch (err) {
    console.error('Update category error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/categories/:id - Delete category (admin)
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = getDb();

    const { error } = await db
      .from('categories')
      .delete()
      .eq('id', Number(id));

    if (error) throw new Error(`Delete failed: ${error.message}`);

    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    console.error('Delete category error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

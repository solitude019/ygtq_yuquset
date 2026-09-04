import { Router, type Request, type Response } from 'express';
import { getDb } from '../lib/supabase';
import { authMiddleware } from './auth';

const router = Router();

// GET /api/products - List all products (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const db = getDb();

    let query = db
      .from('products')
      .select('*, categories(name)')
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category_id', Number(category));
    }

    const { data, error } = await query;
    if (error) throw new Error(`Query failed: ${error.message}`);

    // Flatten the nested category data
    const products = (data || []).map((row: Record<string, unknown>) => {
      const cat = row.categories as { name: string } | null;
      return {
        ...row,
        category_name: cat?.name || null,
        categories: undefined,
      };
    });

    res.json({ success: true, data: products });
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/products/:id - Get single product (public)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = getDb();

    const { data, error } = await db
      .from('products')
      .select('*, categories(name)')
      .eq('id', Number(id))
      .maybeSingle();

    if (error) throw new Error(`Query failed: ${error.message}`);
    if (!data) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const cat = data.categories as { name: string } | null;
    const product = { ...data, category_name: cat?.name || null, categories: undefined };

    res.json({ success: true, data: product });
  } catch (err) {
    console.error('Get product error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/products - Create product (admin)
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { product_no, name, category_id, price, stock, image_url, description } =
      req.body as Record<string, unknown>;

    if (!product_no || !name || price === undefined) {
      res.status(400).json({ error: 'Product number, name and price are required' });
      return;
    }

    const db = getDb();
    const { data, error } = await db
      .from('products')
      .insert({
        product_no,
        name,
        category_id: category_id || null,
        price,
        stock: stock || 0,
        image_url: image_url || '',
        description: description || '',
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        res.status(409).json({ error: 'Product number already exists' });
        return;
      }
      throw new Error(`Insert failed: ${error.message}`);
    }

    res.status(201).json({ success: true, data });
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/products/:id - Update product (admin)
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates: Record<string, unknown> = {};
    const fields = ['product_no', 'name', 'category_id', 'price', 'stock', 'image_url', 'description'] as const;

    for (const field of fields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }
    updates.updated_at = new Date().toISOString();

    const db = getDb();
    const { data, error } = await db
      .from('products')
      .update(updates)
      .eq('id', Number(id))
      .select()
      .maybeSingle();

    if (error) throw new Error(`Update failed: ${error.message}`);
    if (!data) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json({ success: true, data });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/products/:id - Delete product (admin)
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = getDb();

    const { error } = await db
      .from('products')
      .delete()
      .eq('id', Number(id));

    if (error) throw new Error(`Delete failed: ${error.message}`);

    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

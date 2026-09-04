import { Router, type Request, type Response } from 'express';
import { query, execute } from '../lib/db';
import { authMiddleware } from './auth';

const router = Router();

interface ProductRow {
  id: number;
  product_no: string;
  name: string;
  category_id: number | null;
  price: number;
  stock: number;
  image_url: string;
  description: string;
  created_at: string;
  updated_at: string;
  category_name: string | null;
}

const PRODUCT_COLUMNS =
  'p.id, p.product_no, p.name, p.category_id, p.price, p.stock, p.image_url, ' +
  'p.description, p.created_at, p.updated_at, c.name AS category_name';

// GET /api/products - List all products (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    let sql =
      `SELECT ${PRODUCT_COLUMNS} FROM products p ` +
      'LEFT JOIN categories c ON p.category_id = c.id';
    const params: unknown[] = [];

    if (category) {
      sql += ' WHERE p.category_id = ?';
      params.push(Number(category));
    }
    sql += ' ORDER BY p.created_at DESC';

    const rows = await query<ProductRow[]>(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/products/:id - Get single product (public)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rows = await query<ProductRow[]>(
      `SELECT ${PRODUCT_COLUMNS} FROM products p ` +
        'LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ? LIMIT 1',
      [Number(id)]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('Get product error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/products/batch-delete - Delete multiple products (admin)
router.post('/batch-delete', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { ids } = req.body as { ids?: unknown };

    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ error: 'A non-empty array of product ids is required' });
      return;
    }

    const numericIds = (ids as unknown[])
      .map(Number)
      .filter((n) => Number.isInteger(n) && n > 0);
    if (numericIds.length === 0) {
      res.status(400).json({ error: 'No valid product ids provided' });
      return;
    }

    const placeholders = numericIds.map(() => '?').join(', ');
    const result = await execute(
      `DELETE FROM products WHERE id IN (${placeholders})`,
      numericIds
    );

    res.json({ success: true, data: { deleted: result.affectedRows } });
  } catch (err) {
    console.error('Batch delete products error:', err);
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

    const result = await execute(
      'INSERT INTO products (product_no, name, category_id, price, stock, image_url, description) ' +
        'VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        product_no,
        name,
        category_id || null,
        price,
        stock || 0,
        image_url || '',
        description || '',
      ]
    );

    const rows = await query<ProductRow[]>(
      `SELECT ${PRODUCT_COLUMNS} FROM products p ` +
        'LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ? LIMIT 1',
      [result.insertId]
    );

    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    const e = err as { code?: string };
    if (e.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Product number already exists' });
      return;
    }
    console.error('Create product error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/products/:id - Update product (admin)
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const fields = ['product_no', 'name', 'category_id', 'price', 'stock', 'image_url', 'description'] as const;

    const sets: string[] = [];
    const params: unknown[] = [];
    for (const field of fields) {
      if (req.body[field] !== undefined) {
        sets.push(`${field} = ?`);
        params.push(req.body[field]);
      }
    }

    if (sets.length === 0) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }
    sets.push('updated_at = NOW()');
    params.push(Number(id));

    try {
      await execute(`UPDATE products SET ${sets.join(', ')} WHERE id = ?`, params);
    } catch (err) {
      const e = err as { code?: string };
      if (e.code === 'ER_DUP_ENTRY') {
        res.status(409).json({ error: 'Product number already exists' });
        return;
      }
      throw err;
    }

    const rows = await query<ProductRow[]>(
      `SELECT ${PRODUCT_COLUMNS} FROM products p ` +
        'LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ? LIMIT 1',
      [Number(id)]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/products/:id - Delete product (admin)
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await execute('DELETE FROM products WHERE id = ?', [Number(id)]);
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

import { Router, type Request, type Response } from 'express';
import { getPool, type QueryRows, type DbRow } from '../lib/db';
import { authMiddleware } from './auth';

const router = Router();

interface ProductRow extends DbRow {
  id: number;
  product_no: string;
  name: string;
  category_id: number | null;
  price: number | string;
  stock: number;
  image_url: string;
  description: string;
  created_at: Date | string;
  updated_at: Date | string;
  category_name: string | null;
}

function mapProduct(row: DbRow): ProductRow {
  return {
    id: Number(row.id),
    product_no: String(row.product_no),
    name: String(row.name),
    category_id: row.category_id !== null && row.category_id !== undefined ? Number(row.category_id) : null,
    price: row.price as number | string,
    stock: Number(row.stock ?? 0),
    image_url: String(row.image_url ?? ''),
    description: String(row.description ?? ''),
    created_at: (row.created_at as Date | string) ?? null,
    updated_at: (row.updated_at as Date | string) ?? null,
    category_name: row.category_name !== null && row.category_name !== undefined
      ? String(row.category_name)
      : null,
  };
}

// GET /api/products - List all products (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const pool = getPool();

    let sql = `
      SELECT p.id, p.product_no, p.name, p.category_id, p.price, p.stock,
             p.image_url, p.description, p.created_at, p.updated_at,
             c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
    `;
    const params: unknown[] = [];

    if (category) {
      sql += ' WHERE p.category_id = ?';
      params.push(Number(category));
    }

    sql += ' ORDER BY p.created_at DESC';

    const [rows] = await pool.query<QueryRows>(sql, params);
    const products = rows.map(mapProduct);

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
    const pool = getPool();

    const [rows] = await pool.query<QueryRows>(
      `SELECT p.id, p.product_no, p.name, p.category_id, p.price, p.stock,
              p.image_url, p.description, p.created_at, p.updated_at,
              c.name AS category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?
       LIMIT 1`,
      [Number(id)]
    );

    const row = rows[0];
    if (!row) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json({ success: true, data: mapProduct(row) });
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

    if (!product_no || !name || price === undefined || price === null) {
      res.status(400).json({ error: 'Product number, name and price are required' });
      return;
    }

    const pool = getPool();
    const [result] = await pool.execute(
      `INSERT INTO products (product_no, name, category_id, price, stock, image_url, description)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        String(product_no),
        String(name),
        category_id ? Number(category_id) : null,
        Number(price),
        stock !== undefined && stock !== null ? Number(stock) : 0,
        image_url ? String(image_url) : '',
        description ? String(description) : '',
      ]
    );

    const insertId = (result as { insertId: number }).insertId;
    const [rows] = await pool.query<QueryRows>(
      `SELECT p.id, p.product_no, p.name, p.category_id, p.price, p.stock,
              p.image_url, p.description, p.created_at, p.updated_at,
              c.name AS category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?
       LIMIT 1`,
      [insertId]
    );

    res.status(201).json({ success: true, data: mapProduct(rows[0]) });
  } catch (err) {
    const e = err as { code?: string; message?: string };
    console.error('Create product error:', err);
    if (e.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Product number already exists' });
      return;
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/products/:id - Update product (admin)
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const fields = ['product_no', 'name', 'category_id', 'price', 'stock', 'image_url', 'description'] as const;

    const setClauses: string[] = [];
    const params: Array<string | number | null> = [];

    for (const field of fields) {
      if (req.body[field] !== undefined) {
        setClauses.push(`${field} = ?`);
        const value = req.body[field];
        if (field === 'category_id') {
          params.push(value ? Number(value) : null);
        } else if (field === 'price' || field === 'stock') {
          params.push(Number(value));
        } else {
          params.push(String(value));
        }
      }
    }

    if (setClauses.length === 0) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }

    setClauses.push('updated_at = NOW()');
    params.push(Number(id));

    const pool = getPool();
    const [result] = await pool.execute(
      `UPDATE products SET ${setClauses.join(', ')} WHERE id = ?`,
      params
    );

    if ((result as { affectedRows: number }).affectedRows === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const [rows] = await pool.query<QueryRows>(
      `SELECT p.id, p.product_no, p.name, p.category_id, p.price, p.stock,
              p.image_url, p.description, p.created_at, p.updated_at,
              c.name AS category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?
       LIMIT 1`,
      [Number(id)]
    );

    res.json({ success: true, data: mapProduct(rows[0]) });
  } catch (err) {
    const e = err as { code?: string };
    console.error('Update product error:', err);
    if (e.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Product number already exists' });
      return;
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/products/:id - Delete product (admin)
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    const [result] = await pool.execute('DELETE FROM products WHERE id = ?', [Number(id)]);

    if ((result as { affectedRows: number }).affectedRows === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

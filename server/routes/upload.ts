import { Router, type Request, type Response } from 'express';
import multer from 'multer';
import { getDb } from '../lib/supabase';

const router = Router();

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

// In-memory storage; buffer is uploaded to Supabase Storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter: (_req: Request, file: Express.Multer.File, cb) => {
    if (ALLOWED_TYPES[file.mimetype]) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG or PNG images are allowed'));
    }
  },
});

const BUCKET = 'product-images';

/**
 * POST /api/upload
 * Upload a single product image (field name: "image").
 * Requires authentication (enforced at router registration).
 * Returns the public URL of the uploaded file.
 */
router.post('/', upload.single('image'), async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const ext = ALLOWED_TYPES[file.mimetype];
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;

    const db = getDb();
    const { error: uploadError } = await db.storage
      .from(BUCKET)
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError.message);
      return res.status(500).json({ error: 'Image upload failed' });
    }

    const { data: urlData } = db.storage
      .from(BUCKET)
      .getPublicUrl(filename);

    return res.status(201).json({
      success: true,
      data: { url: urlData.publicUrl, filename },
    });
  } catch (error) {
    console.error('Upload handler error:', error);
    const message = error instanceof Error ? error.message : 'Upload failed';
    return res.status(500).json({ error: message });
  }
});

// Multer / validation error handler
router.use(
  (
    err: unknown,
    _req: Request,
    res: Response,
    _next: unknown,
  ) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'Image size must not exceed 5MB' });
      }
      return res.status(400).json({ error: err.message });
    }
    if (err instanceof Error) {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: 'Upload failed' });
  },
);

export default router;

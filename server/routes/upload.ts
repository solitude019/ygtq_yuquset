import { Router, type Request, type Response } from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';
import { getUploadRootDir } from '../lib/config';

const router = Router();

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

// Files are held in memory then written to the configured local directory.
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

/**
 * POST /api/upload
 * Upload a single product image (field name: "image").
 * Files are stored locally under the upload root directory (config table,
 * key `upload_root_dir`). Requires authentication (enforced at router registration).
 * Returns the public URL of the uploaded file, served under /uploads/*.
 */
router.post('/', upload.single('image'), async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const ext = ALLOWED_TYPES[file.mimetype];
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;

    // Resolve the storage root from the config table.
    const rootDir = await getUploadRootDir();
    await fs.mkdir(rootDir, { recursive: true });

    const targetPath = path.join(rootDir, filename);
    await fs.writeFile(targetPath, file.buffer);

    // Files are served statically under /uploads (see server.ts).
    return res.status(201).json({
      success: true,
      data: { url: `/uploads/${filename}`, filename },
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
    const message = err instanceof Error ? err.message : 'Upload failed';
    return res.status(400).json({ error: message });
  },
);

export default router;

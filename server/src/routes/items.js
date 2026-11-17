import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import db from '../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');

// Configure Multer storage for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `item_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    const mime = file.mimetype;
    if (allowed.test(ext) && allowed.test(mime)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, WEBP, or GIF images under 5MB are permitted.'));
    }
  }
});

const router = express.Router();

// GET /api/items/categories
router.get('/categories', (req, res) => {
  const categories = db.getCategories();
  res.json(categories);
});

// GET /api/items
router.get('/', (req, res) => {
  const { status, type, category, search, posted_by } = req.query;
  const items = db.getItems({ status, type, category, search, posted_by });
  res.json(items);
});

// GET /api/items/:id
router.get('/:id', (req, res) => {
  const item = db.getItemById(req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.json(item);
});

// POST /api/items (with optional photo upload)
router.post('/', upload.single('image'), (req, res) => {
  try {
    const {
      item_type,
      category_id,
      title,
      description,
      location,
      date_lost_found,
      posted_by,
      contact,
      status
    } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({ error: 'Title, description, and location are required.' });
    }

    let imageFilename = req.file ? req.file.filename : (req.body.image || '');

    // Handle base64 image data sent as JSON
    if (!req.file && req.body.image && typeof req.body.image === 'string' && req.body.image.startsWith('data:image/')) {
      try {
        const matches = req.body.image.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
        if (matches) {
          const rawExt = matches[1].toLowerCase();
          const ext = rawExt === 'jpeg' ? 'jpg' : rawExt;
          const buffer = Buffer.from(matches[2], 'base64');
          const generatedFilename = `item_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
          fs.writeFileSync(path.join(UPLOAD_DIR, generatedFilename), buffer);
          imageFilename = generatedFilename;
        }
      } catch (writeErr) {
        console.error('Failed to write base64 image upload:', writeErr);
      }
    }

    const newItem = db.addItem({
      item_type,
      category_id,
      title,
      description,
      location,
      date_lost_found,
      image: imageFilename,
      posted_by,
      contact,
      status: status || 'pending'
    });

    res.status(201).json({
      message: newItem.status === 'open' ? 'Item published successfully' : 'Item queued for verification',
      item: newItem
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Server error creating item' });
  }
});

// PUT /api/items/:id/status
router.put('/:id/status', (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const updated = db.updateItem(req.params.id, { status });
  if (!updated) {
    return res.status(404).json({ error: 'Item not found' });
  }

  res.json({ message: 'Status updated', item: updated });
});

// PUT /api/items/:id/claim
router.put('/:id/claim', (req, res) => {
  const { claimed_by, claimed_contact, claim_note } = req.body;
  if (!claim_note || !claim_note.trim()) {
    return res.status(400).json({ error: 'Verification claim details are required.' });
  }

  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const updated = db.updateItem(req.params.id, {
    status: 'claimed',
    claimed_by: claimed_by || 'Student',
    claimed_contact: claimed_contact || '',
    claim_note: claim_note.trim(),
    claimed_at: now
  });

  if (!updated) {
    return res.status(404).json({ error: 'Item not found' });
  }

  res.json({ message: 'Claim submitted successfully', item: updated });
});

// DELETE /api/items/:id
router.delete('/:id', (req, res) => {
  const success = db.deleteItem(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.json({ message: 'Item deleted successfully' });
});

export default router;

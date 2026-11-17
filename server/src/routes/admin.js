import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET /api/admin/stats
router.get('/stats', (req, res) => {
  const stats = db.getStatistics();
  res.json(stats);
});

// GET /api/admin/queue
router.get('/queue', (req, res) => {
  const pending = db.getItems({ status: 'pending' });
  res.json(pending);
});

// PUT /api/admin/verify/:id (approve or reject)
router.put('/verify/:id', (req, res) => {
  const { action } = req.body; // 'approve' | 'reject'
  const itemId = req.params.id;

  if (action === 'approve') {
    const updated = db.updateItem(itemId, { status: 'open' });
    if (!updated) {
      return res.status(404).json({ error: 'Item not found' });
    }
    return res.json({ message: 'Item approved and published', item: updated });
  } else if (action === 'reject') {
    const deleted = db.deleteItem(itemId);
    if (!deleted) {
      return res.status(404).json({ error: 'Item not found' });
    }
    return res.json({ message: 'Item rejected and deleted' });
  }

  res.status(400).json({ error: 'Invalid action. Must be approve or reject.' });
});

// POST /api/admin/reset
router.post('/reset', (req, res) => {
  const items = db.reset();
  res.json({ message: 'Demo data restored', items });
});

export default router;

import express from 'express';

const router = express.Router();

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

// POST /api/auth/student (login by name, no password needed)
router.post('/student', (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Please enter your name to continue' });
  }

  const cleanName = name.trim();
  const student = {
    id: Date.now(),
    name: cleanName,
    email: `${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@campus.edu`,
    studentId: `STU-${Math.floor(1000 + Math.random() * 9000)}`,
    role: 'student',
    avatar: cleanName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
  };

  res.json({ message: `Welcome, ${cleanName}`, user: student });
});

// POST /api/auth/admin (admin/admin123)
router.post('/admin', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Please enter both username and password' });
  }

  if (username.trim() === ADMIN_USERNAME && password.trim() === ADMIN_PASSWORD) {
    const admin = {
      id: 1,
      name: 'Campus Admin (Proctor)',
      email: 'admin@campus.edu',
      studentId: 'ADM-001',
      role: 'admin',
      avatar: 'AD'
    };
    return res.json({ message: 'Admin authentication successful', user: admin });
  }

  res.status(401).json({ error: 'Invalid username or password!' });
});

export default router;

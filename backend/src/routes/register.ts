import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../db';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { uid, uname, password, email, phone, role } = req.body;

    if (!uid || !uname || !password || !email || !phone || !role) {
      return res.status(400).json({ error: 'All fields required: uid, uname, password, email, phone, role' });
    }

    if (role !== 'Customer') {
      return res.status(400).json({ error: 'Role must be Customer' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.execute(
      'INSERT INTO kodusers (uid, username, email, password, balance, phone, role) VALUES (?, ?, ?, ?, 100000, ?, ?)',
      [uid, uname, email, hashedPassword, phone, role]
    );

    res.status(201).json({ success: true });
  } catch (err: unknown) {
    const e = err as { code?: string; message?: string };
    console.error('Register error details:', err);
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Username, Email, or UID already exists' });
    }
    if (e.code === 'ECONNREFUSED' || e.code === 'ENOTFOUND') {
      return res.status(503).json({ error: 'Database connection failed. Check MySQL is running and .env credentials.' });
    }
    if (e.code === 'ER_ACCESS_DENIED_ERROR') {
      return res.status(503).json({ error: 'Database access denied. Check DB_USER and DB_PASSWORD in .env' });
    }
    if (e.code === 'ER_BAD_DB_ERROR') {
      return res.status(503).json({ error: 'Database does not exist. Run backend/schema.sql first.' });
    }
    if (e.code === 'ER_NO_SUCH_TABLE') {
      return res.status(503).json({ error: 'Tables not found. Run backend/schema.sql to create kodusers and usertoken.' });
    }
    const msg = e.message || 'Registration failed';
    res.status(500).json({ error: `${msg} (${e.code || 'no-code'})` });
  }
});

export default router;

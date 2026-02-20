import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

router.post('/', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const [rows] = await pool.execute(
      'SELECT uid, username, password, role FROM kodusers WHERE username = ?',
      [username]
    );
    const users = rows as { uid: number; username: string; password: string; role: string }[];

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { sub: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: 7 * 24 * 60 * 60, algorithm: 'HS256' }
    );

    const decoded = jwt.decode(token) as { exp?: number };
    const expiryMs = decoded?.exp ? decoded.exp * 1000 - Date.now() : 7 * 24 * 60 * 60 * 1000;

    await pool.execute(
      'INSERT INTO usertoken (token, uid, expiry) VALUES (?, ?, FROM_UNIXTIME(?))',
      [token, user.uid, Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60]
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: expiryMs,
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;

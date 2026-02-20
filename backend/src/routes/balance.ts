import { Router, Request, Response } from 'express';
import pool from '../db';
import { jwtMiddleware } from '../middleware/jwt';

const router = Router();

router.get('/', jwtMiddleware, async (req: Request, res: Response) => {
  try {
    const username = req.user?.sub;
    if (!username) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const [rows] = await pool.execute(
      'SELECT balance FROM kodusers WHERE username = ?',
      [username]
    );
    const users = rows as { balance: number }[];

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ balance: Number(users[0].balance) });
  } catch (err) {
    console.error('Balance error:', err);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

export default router;

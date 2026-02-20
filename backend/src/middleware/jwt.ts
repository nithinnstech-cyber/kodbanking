import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../db';

declare global {
  namespace Express {
    interface Request {
      user?: { sub: string; role: string };
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }) as { sub: string; role: string; exp: number };

    const [rows] = await pool.execute(
      'SELECT tid FROM usertoken WHERE token = ? AND expiry > NOW()',
      [token]
    );
    const tokens = rows as { tid: number }[];

    if (tokens.length === 0) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = { sub: decoded.sub, role: decoded.role };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

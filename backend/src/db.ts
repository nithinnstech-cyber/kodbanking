import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Support CA certificate for cloud MySQL providers (PEM or base64)
const caPem = process.env.DB_CA_BASE64
  ? Buffer.from(process.env.DB_CA_BASE64, 'base64').toString('utf8')
  : process.env.DB_CA;

const sslOption = process.env.DB_SSL === 'true'
  ? (caPem ? { ca: caPem, rejectUnauthorized: true } : { rejectUnauthorized: false })
  : undefined;

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kodbanking',
  ssl: sslOption,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;

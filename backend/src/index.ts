import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import loginRouter from './routes/login';
import registerRouter from './routes/register';
import balanceRouter from './routes/balance';

const app = express();
const PORT = process.env.PORT || 3001;

// Configure allowed origins via env var `ALLOWED_ORIGINS` (comma-separated)
const defaultOrigins = [
  'http://localhost:5173',
  'https://nithinnstech-cyber.github.io',
  'https://kodbanking-fbs8.onrender.com'
];
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim())
  : defaultOrigins;

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/login', loginRouter);
app.use('/api/register', registerRouter);
app.use('/api/balance', balanceRouter);


if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;

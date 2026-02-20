import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import loginRouter from './routes/login';
import registerRouter from './routes/register';
import balanceRouter from './routes/balance';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/login', loginRouter);
app.use('/api/register', registerRouter);
app.use('/api/balance', balanceRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api';
import './config/firebase';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

app.get('/', (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`AeroPath backend listening on ${port}`));

import express, { Application, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { config } from 'dotenv';
import { connectDB } from './db/conn';

config();

const app: Application = express();
const PORT: string | number = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

// connectDB();

// simple route
app.get('/hello-world', (req: Request, res: Response) => {
    res.send("Hello from smartshop");
});

app.listen(PORT, () => {
    console.log(`app is running on http://localhost:${PORT}`);
});

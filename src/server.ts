import express, { Application, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { config } from 'dotenv';
import { connectDB } from './db/conn';

// TODO: Find shorter method to import and use all routes
// import routes from './routes';
import authRouter from './routes/auth.routes';

config();

const app: Application = express();
const PORT: string | number = process.env.PORT || 3000;

connectDB();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use('/auth', authRouter);

// simple route
app.get('/hello-world', (req: Request, res: Response) => {
    res.send("Hello from smartshop");
});

app.listen(PORT, () => {
    console.log(`app is running on http://localhost:${PORT}`);
});

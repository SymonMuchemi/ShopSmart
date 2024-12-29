import cookieParser from 'cookie-parser';
import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';
import { config } from 'dotenv';
import { connectDB } from './db/conn';

// TODO: Find shorter method to import and use all routes
// import routes from './routes';
import authRouter from './routes/auth.routes';
import productsRouter from './routes/product.routes';

config();

const app: Application = express();
const PORT: string | number = process.env.PORT || 3000;

connectDB();

app.use(morgan('dev'));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "500kb", extended: true }));
app.use(cookieParser(process.env.JWT_SECRET));

app.use('/auth', authRouter);
app.use('/products', productsRouter);

// simple route
app.get('/hello-world', (req: Request, res: Response) => {
    res.send("Hello from smartshop");
});

app.listen(PORT, () => {
    console.log(`app is running on http://localhost:${PORT}`);
});

import cookieParser from 'cookie-parser';
import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';
import { config } from 'dotenv';
import { connectDB } from './db/conn';
import { color } from 'console-log-colors';

// Import routers
import authRouter from './routes/auth.routes';
import productsRouter from './routes/product.routes';
import cartRouter from './routes/cart.routes';
import purchaseRouter from './routes/purchase.routes';
import paymentRouter from './routes/payments.routes';

config();

const app: Application = express();
const PORT: string | number = process.env.PORT || 3000;

connectDB();

app.use(morgan('dev'));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "500kb", extended: true }));
app.use(cookieParser(process.env.JWT_SECRET));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/purchase', purchaseRouter);
app.use('/api/v1/', paymentRouter);

// simple route
app.get('/hello-world', (req: Request, res: Response) => {
    res.send("Hello from smartshop");
});

app.listen(PORT, () => {
    console.log(color.yellowBright.underline(`app is running on http://localhost:${PORT}`));
});

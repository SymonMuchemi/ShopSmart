import cookieParser from 'cookie-parser';
import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';
import { color } from 'console-log-colors';
import cron from 'node-cron';
import logger from './logger/logging';
import { connectDB } from './db/conn';
import { uploadLogsToS3 } from './logger/s3logger';

// Import routers
import authRouter from './routes/auth.routes';
import productsRouter from './routes/product.routes';
import cartRouter from './routes/cart.routes';
import purchaseRouter from './routes/purchase.routes';
import paymentRouter from './routes/payments.routes';

// import error handler middleware
import { errorHandler } from './middleware/errrors';

const app: Application = express();
const PORT: number = 3000;
const NODE_ENV: string = process.env.ENVIROMENT || 'development';

connectDB();

// middlwares
if (NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    cron.schedule('0 0 * * *', () => {
        uploadLogsToS3();
        console.log(color.cyan.inverse('Logs uploaded to S3'));
    });
}
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "500kb", extended: true }));
app.use(cookieParser(process.env.JWT_SECRET));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/purchase', purchaseRouter);
app.use('/api/v1/', paymentRouter);

// simple route
app.get('/api/v1/hello-world', (req: Request, res: Response) => {
    res.send("Hello from smartshop");
});

app.use(errorHandler);

const server = app.listen(PORT, () => {
    console.log(color.yellowBright.underline(`app is running on http://localhost:${PORT}`));
});

process.on('unhandledRejection', (err: any, promise) => {
    logger.error(`Unhandled exception: ${err.message}`);
    console.log(`Error: ${err.message}`);

    server.close(() => process.exit(1));
});

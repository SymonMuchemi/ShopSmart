import mongoose from 'mongoose';
import { color } from 'console-log-colors';

export const connectDB = async () => {
    try {
        // fetch MongoDB URI from AWS Secrets Manager

        const MONGO_DB_URL: string | undefined = process.env.MONGO_DB_URL;

        if (!MONGO_DB_URL) {
            console.log(color.red.inverse('MONGO DB URL NOT FOUND IN SECRET!!!'));
            throw new Error('Could not find mongo db access credentials');
        }

        const conn = await mongoose.connect(MONGO_DB_URL);

        console.log(color.blueBright(`MongoDB connected: ${conn.connection.host}:${conn.connection.port}`));
    } catch (error: any) {
        console.log(color.redBright(`Mongodb connection error: ${error.toString()}`))
    }
}

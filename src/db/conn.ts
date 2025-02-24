import { color } from 'console-log-colors';
import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const DBUrl: string | undefined = process.env.MONGO_DB_URL;

        if (DBUrl === undefined) {
            console.log(color.red.inverse('Invalid db URl'));
            process.exit(1)
        }

        const conn = await mongoose.connect(DBUrl);

        console.log(color.blueBright(`MongoDB connected: ${conn.connection.host}`));
    } catch (error: any) {
        console.log(color.redBright(`Mongodb connection error: ${error.toString()}`))
    }
}

import { color } from 'console-log-colors';
import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const DBUrl: string | undefined = process.env.MONGO_URL;

        if (DBUrl === undefined) {
            console.log('Invalid db URl');
            process.exit(1)
        }

        await mongoose.connect(DBUrl);

        console.log(color.blueBright("MongoDB Connected!"));
    } catch (error: any) {
        console.log(color.redBright(`Mongodb connection error: ${error.toString()}`))
    }
}

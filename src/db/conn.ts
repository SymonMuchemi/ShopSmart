/* eslint-disable @typescript-eslint/no-explicit-any */
import logger from 'console-log-colorizer'
import { color } from 'console-log-colors'
import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    const DBUrl: string | undefined = process.env.MONGO_URL

    if (DBUrl === undefined) {
      console.log('Invalid db URl')
      process.exit(1)
    }

    const conn = await mongoose.connect(DBUrl);

    console.info(color.blueBright.underline(`MongoDB Connected: ${conn.connection.host}`));
  } catch (error: any) {
    console.error(color.redBright.italic(`Mongodb connection error: ${error.toString()}`))
  }
}

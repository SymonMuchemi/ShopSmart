import { createLogger, format, transports } from "winston";
import DailyRotateFile from 'winston-daily-rotate-file';
import path from "path";
import fs from 'fs';

// ensure logs directory exists
const logsDir = path.join(__dirname, 'logs');

if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);

// define log format
const logFormat = format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
);

// create logger
const logger = createLogger({
    level: 'info',
    format: logFormat,
    transports: [
        new transports.Console(), // log to console
        new DailyRotateFile({
            filename: path.join(logsDir, 'app-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
            maxSize: '20m',
            zippedArchive: true
        })
    ]
})

export default logger;

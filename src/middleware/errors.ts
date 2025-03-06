import type { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ErrorResponse } from '../utils';
import multer from 'multer';
import logger from '../logger/logging';
import { color } from 'console-log-colors';

interface Error {
  statusCode?: number;
  message?: string;
  name?: string;
  code?: number;
  value?: string;
  errors?: { [key: string]: { message: string } };
}

export const fileErrorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      logger.error('LIMIT_FILE_SIZE_ERROR');
      res.status(413).json({
        code: 413,
        message: 'File size too large! Maximum allowed size: 5MB.',
      });

      return;
    }
  }
  logger.error(`File handling error: ${err.message}`);
  next(new ErrorResponse(`File handling error: ${err.message}`, 400));
};

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  let error = { ...err };
  error.message = err.message;

  // Mongoose Bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource with id: ${error.value} not found`;
    error = new ErrorResponse(message, 404);
    logger.error(message);
  }

  // Mongo Duplicate Error
  if (err.code === 11000) {
    const message = 'Duplicate field value entered!';
    console.log(color.red.bold(`Req.body: ${JSON.stringify(req.body)}`));
    console.log(color.cyan.bold(`Complete Error mesage: ${err.message}`))
    error = new ErrorResponse(message, 400);
    logger.error(message);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors!).map((val) => val.message).join(", ");
    error = new ErrorResponse(message, 400);
    logger.error(message);
  }

  logger.error(`Error: ${error.message}`);
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
}

import type { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ErrorResponse } from '../utils';
import multer from 'multer';

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
            res.status(413).json({
                code: 413,
                message: 'File size too large! Maximum allowed size: 5MB.',
            });

            return;
        }
    }
    next(new ErrorResponse(`File handling error: ${err.name}`, 400));
};

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    let error = { ...err };
  error.message = err.message;

  // Mongoose Bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource with id: ${error.value} not found`;
    error = new ErrorResponse(message, 404);
  }

  // Mongo Duplicate Error
  if (err.code === 11000) {
    const message = 'Duplicate field value entered!';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors!).map((val) => val.message).join(", ");
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
}

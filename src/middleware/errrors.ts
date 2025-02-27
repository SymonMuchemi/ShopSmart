import type { ErrorRequestHandler } from 'express';
import multer from 'multer';


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
    next(err);
};

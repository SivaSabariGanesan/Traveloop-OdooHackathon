import type { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { uploadCoverPhoto } from '../config/multer';
import { AppError } from '../utils/AppError';

export const handleCoverUpload = (req: Request, res: Response, next: NextFunction) => {
  uploadCoverPhoto(req, res, (err) => {
    if (!err) return next();

    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new AppError('File size must not exceed 5MB', 400));
      }
      return next(new AppError(err.message, 400));
    }

    next(err);
  });
};

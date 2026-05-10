import type { Response } from 'express';

export const sendSuccess = (res: Response, data: any, status: number = 200) => {
  res.status(status).json({
    status: 'success',
    data,
  });
};

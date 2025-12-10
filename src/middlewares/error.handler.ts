import type { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';
import { NODE_ENV } from '../utils/env';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('ERROR:', err.message);

  const statusCode = err.message.includes('tidak ditemukan') ? 404 : 400;

  errorResponse(res, err.message || 'Terjadi kesalahan server', statusCode, 
    NODE_ENV === 'development' ? { stack: err.stack } : null
  );
};
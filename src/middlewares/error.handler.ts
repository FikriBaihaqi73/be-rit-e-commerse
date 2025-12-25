import type { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';
import { NODE_ENV } from '../utils/env';
import { Prisma } from "../generated/client";

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('ERROR:', err.message);

  const statusCode = err.message.includes('tidak ditemukan') ? 404 : 400;

  errorResponse(res, err.message || 'Terjadi kesalahan server', statusCode, 
    NODE_ENV === 'development' ? { stack: err.stack } : null
  );

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: "Data sudah ada (Unique constraint violation)",
        field: err.meta?.target
      });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: "Data tidak ditemukan"
      });
    }
  }
};
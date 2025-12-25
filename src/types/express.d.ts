import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: { // <--- Tambahkan ini
        id: number;
        role: string;
      };
    }
  }
}
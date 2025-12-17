import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_kunci_rahasia';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ success: false, message: 'Token tidak ditemukan' });
    }

    const token = authHeader.split(' ')[1]; // Format: "Bearer <token>"

    if (!token) {
        return res.status(401).json({ success: false, message: 'Format token salah' });
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET) as { id: number; role: string };

        req.user = payload; // Attach user payload to request
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Token tidak valid' });
    }
};
import { body, param } from 'express-validator';

export const createProductValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Nama produk wajib diisi')
    .isLength({ min: 3 }).withMessage('Nama produk minimal 3 karakter'),

  body('description')
    .trim()
    .optional()
    .isLength({ min: 10 }).withMessage('Deskripsi minimal 10 karakter jika diisi'),

  body('price')
    .notEmpty().withMessage('Harga wajib diisi')
    .isNumeric().withMessage('Harga harus angka')
    .custom((value: number) => value > 0).withMessage('Harga harus lebih dari 0'),

  body('stock')
    .notEmpty().withMessage('Stok wajib diisi')
    .isNumeric().withMessage('Stok harus angka')
    .custom((value: number) => value >= 0).withMessage('Stok tidak boleh negatif')
];

export const getProductByIdValidation = [
  param('id')
    .isNumeric().withMessage('ID harus angka')
];
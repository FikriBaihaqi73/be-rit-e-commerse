import { body, param } from 'express-validator';

export const createCategoryValidation = [
    body('name').isString().notEmpty().withMessage('Name is required'),
];

export const getCategoryByIdValidation = [
    param('id').isInt().notEmpty().withMessage('ID is required'),
];
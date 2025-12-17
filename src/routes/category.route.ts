import { Router } from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  searchCategories
} from '../controllers/category.controller';
import { validate } from '../utils/validate';
import { authenticate } from '../middlewares/auth.middleware';
import {
  createCategoryValidation,
  getCategoryByIdValidation
} from '../middlewares/category.validation';

const router = Router();

router.get('/categories', authenticate, getAllCategories);
router.get('/categories/search', authenticate, searchCategories); // Route search harus sebelum :id
router.get('/categories/:id', authenticate, validate(getCategoryByIdValidation), getCategoryById);
router.post('/categories', authenticate, validate(createCategoryValidation), createCategory);
router.put('/categories/:id', authenticate, validate(createCategoryValidation), updateCategory);
router.delete('/categories/:id', authenticate, validate(getCategoryByIdValidation), deleteCategory);

export default router;
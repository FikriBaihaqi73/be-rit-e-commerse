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
import {
  createCategoryValidation,
  getCategoryByIdValidation
} from '../middlewares/category.validation';

const router = Router();

router.get('/categories', getAllCategories);
router.get('/categories/search', searchCategories); // Route search harus sebelum :id
router.get('/categories/:id', validate(getCategoryByIdValidation), getCategoryById);
router.post('/categories', validate(createCategoryValidation), createCategory);
router.put('/categories/:id', validate(createCategoryValidation), updateCategory);
router.delete('/categories/:id', validate(getCategoryByIdValidation), deleteCategory);

export default router;
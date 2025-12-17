import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts
} from '../controllers/product.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../utils/validate';
import { upload } from '../middlewares/upload.middleware';
import {
  createProductValidation,
  getProductByIdValidation
} from '../middlewares/product.validation';

const router = Router();

router.get('/products', authenticate, getAllProducts);
router.get('/products/search', authenticate, searchProducts); // Route search harus sebelum :id
router.get('/products/:id', authenticate, validate(getProductByIdValidation), getProductById);
router.post('/products', authenticate, upload.single('image'), validate(createProductValidation), createProduct);
router.put('/products/:id', authenticate, upload.single('image'), validate(createProductValidation), updateProduct);
router.delete('/products/:id', authenticate, validate(getProductByIdValidation), deleteProduct);

export default router;
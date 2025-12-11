import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts
} from '../controllers/product.controller';
import { validate } from '../utils/validate';
import {
  createProductValidation,
  getProductByIdValidation
} from '../middlewares/product.validation';

const router = Router();

router.get('/products', getAllProducts);
router.get('/products/search', searchProducts); // Route search harus sebelum :id
router.get('/products/:id', validate(getProductByIdValidation), getProductById);
router.post('/products', validate(createProductValidation), createProduct);
router.put('/products/:id', validate(createProductValidation), updateProduct);
router.delete('/products/:id', validate(getProductByIdValidation), deleteProduct);

export default router;
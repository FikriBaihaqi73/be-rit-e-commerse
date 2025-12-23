import { Router } from 'express';
import {
  ProductController
} from '../controllers/product.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../utils/validate';
import { ProductRepository } from '../repositories/product.repository';
import { createProductService, deleteProductService, getAllProductsService, getProductByIdService, getProductStatsService, updateProductService } from '../services/product.service';
import { upload } from '../middlewares/upload.middleware';
import {
  createProductValidation,
  getProductByIdValidation
} from '../middlewares/product.validation';

const router = Router();

const productRepository = new ProductRepository();
const getAllProductsSvc = new getAllProductsService(productRepository);
const getProductByIdSvc = new getProductByIdService(productRepository);
const createProductSvc = new createProductService(productRepository);
const updateProductSvc = new updateProductService(productRepository);
const deleteProductSvc = new deleteProductService(productRepository);
const getProductStatsSvc = new getProductStatsService(productRepository);
const productController = new ProductController(
  getAllProductsSvc,
  getProductByIdSvc,
  createProductSvc,
  updateProductSvc,
  deleteProductSvc,
  getProductStatsSvc
);

router.get('/products', authenticate, productController.getAllProducts);
router.get('/products/stats', authenticate, productController.getStats);
router.get('/products/:id', authenticate, validate(getProductByIdValidation), productController.getProductById);
router.post('/products', authenticate, upload.single('image'), validate(createProductValidation), productController.createProduct);
router.put('/products/:id', authenticate, upload.single('image'), validate(createProductValidation), productController.updateProduct);
router.delete('/products/:id', authenticate, validate(getProductByIdValidation), productController.deleteProduct);

export default router;
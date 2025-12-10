import type { Request, Response } from 'express';
import * as ProductService  from '../services/product.service';
import { asyncHandler } from '../utils/async.handler';
import { successResponse } from '../utils/response';

export const getAllProducts = asyncHandler(async (_req: Request, res: Response) => {
  const products = await ProductService.getAllProducts();
  return successResponse(res, 'Daftar produk', products);
});

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id!);
  const product = await ProductService.getProductById(id);
  return successResponse(res, 'Produk ditemukan', product);
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await ProductService.createProduct(req.body);
  return successResponse(res, 'Produk berhasil ditambahkan', product, null, 201);
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id!);
  const product = await ProductService.updateProduct(id, req.body);
  return successResponse(res, 'Produk berhasil diupdate', product);
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id!);
  const product = await ProductService.deleteProduct(id);
  return successResponse(res, 'Produk berhasil dihapus', product);
});

export const searchProducts = asyncHandler(async (req: Request, res: Response) => {
  const { name, max_price } = req.query;
  const products = await ProductService.searchProducts(
    name as string, 
    max_price ? Number(max_price) : undefined
  );
  return successResponse(res, 'Hasil pencarian', products);
});
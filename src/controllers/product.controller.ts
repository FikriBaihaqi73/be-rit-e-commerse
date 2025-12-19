import type { Request, Response } from 'express';
import * as ProductService  from '../services/product.service';
import { asyncHandler } from '../utils/async.handler';
import { successResponse } from '../utils/response';

export const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
    // 1. Ambil Query Params dengan Default Value
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search as string;
  const sortBy = req.query.sortBy as string;
  const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';

  const result = await ProductService.getAllProducts({
    page,
    limit,
    search,
    sortBy,
    sortOrder,
  });

    const pagination = {
    page: result.currentPage,
    limit: limit,
    total: result.totalItems,
    totalPages: result.totalPages
  };

  return successResponse(res, 'Daftar produk', result.products, pagination);
});

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id!);
  const product = await ProductService.getProductById(id);
  return successResponse(res, 'Produk ditemukan', product);
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
    const file = req.file; // Ambil file dari request
  
  if (!file) {
      return res.status(400).json({ message: "Image is required" });
  }

  // Buat URL relatif untuk disimpan di DB
  const imageUrl = `/public/uploads/${file.filename}`;

  // Gabungkan data body dengan URL gambar
  const productData = {
      ...req.body,
      price: Number(req.body.price), // Konversi manual karena form-data mengirim string
      stock: Number(req.body.stock),
      categoryId: Number(req.body.categoryId),
      image: imageUrl
  };
  const product = await ProductService.createProduct(productData);
  return successResponse(res, 'Produk berhasil ditambahkan', product, null, 201);
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const file = req.file; // Ambil file dari request
  
  if (!file) {
      return res.status(400).json({ message: "Image is required" });
  }

  // Buat URL relatif untuk disimpan di DB
  const imageUrl = `/public/uploads/${file.filename}`;

  // Gabungkan data body dengan URL gambar
  const productData = {
      ...req.body,
      price: Number(req.body.price), // Konversi manual karena form-data mengirim string
      stock: Number(req.body.stock),
      categoryId: Number(req.body.categoryId),
      image: imageUrl
  };
  const id = parseInt(req.params.id!);
  const product = await ProductService.updateProduct(id, productData);
  return successResponse(res, 'Produk berhasil diupdate', product);
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id!);
  const product = await ProductService.deleteProduct(id);
  return successResponse(res, 'Produk berhasil dihapus', product);
});
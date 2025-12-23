import type { Request, Response } from 'express';
import {
  createProductService,
  deleteProductService,
  getAllProductsService,
  getProductByIdService,
  getProductStatsService,
  updateProductService
} from '../services/product.service';
import { asyncHandler } from '../utils/async.handler';
import { successResponse } from '../utils/response';

export class ProductController {
  constructor(
    private getAllProductsSvc: getAllProductsService,
    private getProductByIdSvc: getProductByIdService,
    private createProductSvc: createProductService,
    private updateProductSvc: updateProductService,
    private deleteProductSvc: deleteProductService,
    private getProductStatsSvc: getProductStatsService
  ) { }

  getAllProducts = asyncHandler(async (req: Request, res: Response) => {
    // 1. Ambil Query Params dengan Default Value
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string;
    const sortBy = req.query.sortBy as string;
    const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';

    const result = await this.getAllProductsSvc.execute({
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

  getStats = asyncHandler(async (req: Request, res: Response) => {
    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
    const stats = await this.getProductStatsSvc.execute(categoryId);
    return successResponse(res, 'Statistik produk berhasil diambil', stats);
  });

  getProductById = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id!);
    const product = await this.getProductByIdSvc.execute(id);
    return successResponse(res, 'Produk ditemukan', product);
  });

  createProduct = asyncHandler(async (req: Request, res: Response) => {
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
    const product = await this.createProductSvc.execute(productData);
    return successResponse(res, 'Produk berhasil ditambahkan', product, null, 201);
  });

  updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const file = req.file; // Ambil file dari request
    let imageUrl = req.body.image; // Gunakan image existing jika tidak ada file baru

    if (file) {
      imageUrl = `/public/uploads/${file.filename}`;
    }

    // Gabungkan data body dengan URL gambar
    const productData = {
      ...req.body,
      price: req.body.price ? Number(req.body.price) : undefined,
      stock: req.body.stock ? Number(req.body.stock) : undefined,
      categoryId: req.body.categoryId ? Number(req.body.categoryId) : undefined,
      image: imageUrl
    };
    const id = parseInt(req.params.id!);
    const product = await this.updateProductSvc.execute(id, productData);
    return successResponse(res, 'Produk berhasil diupdate', product);
  });

  deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id!);
    const product = await this.deleteProductSvc.execute(id);
    return successResponse(res, 'Produk berhasil dihapus', product);
  });
}
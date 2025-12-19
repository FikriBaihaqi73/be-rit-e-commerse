import prisma from '../prisma';
import type { Product } from '../generated/client';

interface findAllParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface ProductListResponse {
  products: Product[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export const getAllProducts = async (params: findAllParams): Promise<ProductListResponse> => {
  const { page, limit, search, sortBy, sortOrder } = params;

  const skip = (page - 1) * limit;

  // 1. Buat Filter (Where Clause)
  const whereClause: any = {
    deletedAt: null // Selalu filter yang belum dihapus (soft delete)
  };

  if (search) {
    whereClause.name = { contains: search, mode: 'insensitive' };
  }

  // 2. Ambil Data dengan Pagination & Sorting
  const products = await prisma.product.findMany({
    skip: skip,
    take: limit,
    where: whereClause,
    // Gunakan array untuk orderBy agar dinamis
    orderBy: sortBy ? { [sortBy]: sortOrder || 'desc' } : { createdAt: 'desc' },
    include: {
      category: true
    }
  });

  // 3. Hitung Total Data (untuk metadata pagination)
  const totalItems = await prisma.product.count({
    where: whereClause
  });

  return {
    products,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
    currentPage: page
  };
};

export const getProductById = async (id: number): Promise<Product> => {
  const product = await prisma.product.findUnique({
    where: { id, deletedAt: null },
    include: {
      category: true,
    },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  return product;
};

export const createProduct = async (data: {
  name: string;
  price: number;
  stock: number;
  description?: string;
  categoryId: number;
  image?: string;
}): Promise<Product> => {
  return await prisma.product.create({
    data: {
      name: data.name,
      description: data.description ?? null,
      price: data.price,
      stock: data.stock,
      categoryId: data.categoryId,
      image: data.image ?? null,
    },
  });
};

export const updateProduct = async (id: number, data: Partial<Product>): Promise<Product> => {
  await getProductById(id); // Cek existance

  return await prisma.product.update({
    where: { id },
    data,
  });
};

export const deleteProduct = async (id: number): Promise<Product> => {
  await getProductById(id); // Cek existance

  return await prisma.product.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });
};

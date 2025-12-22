import * as productRepo from '../repositories/product.repository';
import type { Product, Prisma } from '../generated/client';

interface findAllParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const getAllProducts = async (params: findAllParams) => {
  const { page, limit, search, sortBy, sortOrder } = params;
  const skip = (page - 1) * limit;

  // Logic filter (Where Clause)
  const whereClause: Prisma.ProductWhereInput = {
    deletedAt: null,
  };

  if (search) {
    whereClause.name = { contains: search, mode: 'insensitive' };
  }

  // Cast sortBy to any to avoid strict key checking issues with dynamic keys
  // In a stricter app, you would validate that sortBy is a valid key of Product
  const sortCriteria: any = sortBy ? { [sortBy]: sortOrder || 'desc' } : { createdAt: 'desc' };

  // Panggil Repository
  const products = await productRepo.findAll(skip, limit, whereClause, sortCriteria);
  const totalItems = await productRepo.countAll(whereClause);

  return {
    products,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
    currentPage: page
  };
};

export const getProductById = async (id: number): Promise<Product> => {
  // Gunakan repository untuk mencari data
  const product = await productRepo.findById(id);

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

  // Mapping data ke Prisma ProductCreateInput
  // Kita gunakan 'connect' untuk menghubungkan relasi category agar lebih aman
  const createData: Prisma.ProductCreateInput = {
    name: data.name,
    description: data.description ?? null,
    price: data.price,
    stock: data.stock,
    image: data.image ?? null,
    category: {
      connect: { id: data.categoryId }
    }
  };

  return await productRepo.create(createData);
};

export const updateProduct = async (id: number, data: Partial<Product>): Promise<Product> => {
  await getProductById(id); // Cek existance (akan throw jika not found)

  // Prisma Update Input type is slightly different, but Partial<Product> usually maps fine 
  // for scalar fields. However, strict typing might require cleaning 'id', 'createdAt' etc.
  // For simplicity in this learning module, we cast to any or pass as is if compatible.

  return await productRepo.update(id, data as Prisma.ProductUpdateInput);
};

export const deleteProduct = async (id: number): Promise<Product> => {
  await getProductById(id); // Cek existance

  return await productRepo.softDelete(id);
};

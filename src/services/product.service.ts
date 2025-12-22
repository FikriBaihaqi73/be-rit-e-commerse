import { ProductRepository } from '../repositories/product.repository';
import type { Prisma } from '../generated/client';

interface findAllParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class getAllProductsService {
  constructor(private productRepo: ProductRepository) { }

  async execute(params: findAllParams) {
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
    const products = await this.productRepo.findAll(skip, limit, whereClause, sortCriteria);
    const totalItems = await this.productRepo.countAll(whereClause);

    return {
      products,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page
    };
  }
}

export class getProductByIdService {
  constructor(private productRepo: ProductRepository) { }

  async execute(id: number) {
    const product = await this.productRepo.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }
}

export class createProductService {
  constructor(private productRepo: ProductRepository) { }

  async execute(data: {
    name: string;
    price: number;
    stock: number;
    description?: string;
    categoryId: number;
    image?: string;
  }) {
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
    return await this.productRepo.create(createData);
  }
}


export class updateProductService {
  constructor(private productRepo: ProductRepository) { }

  async execute(id: number, data: any) {
    const product = await this.productRepo.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return await this.productRepo.update(id, data);
  }
}

export class deleteProductService {
  constructor(private productRepo: ProductRepository) { }

  async execute(id: number) {
    const product = await this.productRepo.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return await this.productRepo.softDelete(id);
  }
}

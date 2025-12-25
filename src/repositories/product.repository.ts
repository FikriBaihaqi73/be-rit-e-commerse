import prisma from '../prisma';
import type { Prisma } from '../generated/client';

export class ProductRepository {
  async findAll(skip: number, take: number, where: Prisma.ProductWhereInput, orderBy: Prisma.ProductOrderByWithRelationInput) {
    return await prisma.product.findMany({
      skip,
      take,
      where,
      orderBy,
      include: { category: true } // Relation selalu diurus di repo atau service sesuai kebutuhan
    });
  }

  async findComplex(categoryName: string, maxPrice: number) {
    return await prisma.product.findMany({
      where: {
        OR: [
          {
            AND: [
              { category: { name: categoryName } },
              { price: { lte: maxPrice } }
            ]
          },
        ]
      }
    })
  }

  async getStatistics(categoryId?: number) {
    return await prisma.product.aggregate({
      where: {
        deletedAt: null,
        ...(categoryId ? { categoryId } : {}),
      },
      _count: { id: true },
      _avg: { price: true },
      _max: { price: true },
      _min: { price: true },
      _sum: { stock: true }
    });
  }

async getProductsByCategoryStats(categoryId?: number) {
  return await prisma.product.groupBy({
    by: ['categoryId'],
    where: {
      deletedAt: null,
      ...(categoryId ? { categoryId } : {}), // Tambahkan filter ini
    },
    _count: { id: true },
    _avg: { price: true }
  });
}

  async countAll(where: Prisma.ProductWhereInput) {
    return await prisma.product.count({ where });
  }

  async findById(id: number) {
    return await prisma.product.findUnique({
      where: { id, deletedAt: null },
      include: { category: true }
    });
  }

  async create(data: Prisma.ProductCreateInput) {
    return await prisma.product.create({ data });
  }

  async update(id: number, data: Prisma.ProductUpdateInput) {
    return await prisma.product.update({
      where: { id },
      data
    });
  }

  async softDelete(id: number) {
    return await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}
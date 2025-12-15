import  prisma  from '../prisma';
import type { Product } from '../generated/client';

export const getAllProducts = async (): Promise<Product[]> => {
  return await prisma.product.findMany({
    include: {
      category: true,
    },
    where: {
      deletedAt: null,
    },
  });
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
}): Promise<Product> => {
  return await prisma.product.create({
    data: {
      name: data.name,
      description: data.description ?? null,
      price: data.price,
      stock: data.stock,
      categoryId: data.categoryId,
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

export const searchProducts = async (name?: string, maxPrice?: number): Promise<Product[]> => {
  let result = await getAllProducts();
  if (name) {
    result = result.filter(p => p.name.toLowerCase().includes(name.toLowerCase()));
  }
  if (maxPrice) {
    result = result.filter(p => p.price.toNumber() <= maxPrice);
  }
  return result;
};

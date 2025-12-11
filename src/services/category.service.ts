import  prisma  from "../prisma";
import type { Category } from "../generated/client";

export const getAllCategories = async (): Promise<Category[]> => {
    return await prisma.category.findMany();
};

export const getCategoryById = async (id: number): Promise<Category> => {
    const category = await prisma.category.findUnique({
        where: { id },
    });
    
    if (!category) {
        throw new Error('Category not found');
    }
    
    return category;
};

export const createCategory = async (data: { name: string }): Promise<Category> => {
    return await prisma.category.create({
        data: {
            name: data.name,
        },
    });
};

export const updateCategory = async (id: number, data: Partial<Category>): Promise<Category> => {
    await getCategoryById(id); // Cek existance

    return await prisma.category.update({
        where: { id },
        data,
    });
};

export const deleteCategory = async (id: number): Promise<Category> => {
    await getCategoryById(id); // Cek existance

    return await prisma.category.delete({
        where: { id },
    });
};

export const searchCategories = async (name?: string): Promise<Category[]> => {
    let result = await getAllCategories();
    if (name) {
        result = result.filter(c => c.name.toLowerCase().includes(name.toLowerCase()));
    }
    return result;
};
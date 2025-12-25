import prisma from "../database"

export const checkout = async (userId: number, items: { productId: number; quantity: number }[]) => {
  return await prisma.$transaction(async (tx: any) => {
    let total = 0;
    const transactionItemsData = [];

    // 1. Loop setiap item untuk ambil data Product asli (Harga & Stok)
    for (const item of items) {
      const product = await tx.product.findUnique({
        where: { id: item.productId }
      });

      if (!product) {
        throw new Error(`Product ID ${item.productId} not found`);
      }

      // Validasi Stok (Optional tapi recommended)
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${product.name}`);
      }

      // Hitung Total (Harga DB x Quantity Request)
      const currentPrice = Number(product.price);
      total += currentPrice * item.quantity;

      // Siapkan data untuk disimpan ke pivot TransactionItem
      transactionItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        priceAtTime: product.price // PENTING: Simpan harga saat transaksi terjadi
      });

      // Update Stok (Decrement)
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      });
    }

    // 2. Buat Header Transaksi & Detail Items sekaligus (Nested Write)
    const newTransaction = await tx.transaction.create({
      data: {
        userId,
        total, // Total hasil perhitungan real
        items: {
          create: transactionItemsData // Insert ke table pivot
        }
      },
      include: {
        items: {
          include: { product: true } // Return response lengkap
        }
      }
    });

    return newTransaction;
  });
};

export const getTransactionById = async (id: number) => {
  return await prisma.transaction.findUnique({
    where: { id },
    include: {
      user: true, // Ambil data user
      items: {    // Ambil data items
        include: {
          product: true // Di dalam item, ambil data produknya (Nested Include)
        }
      }
    }
  });
};
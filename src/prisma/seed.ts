import prisma from "../prisma";


async function main() {
    console.log("🌱 Starting Seeding...");

    // 1. Clean up existing data (Optional: hati-hati di production!)
    // await prisma.transactionItem.deleteMany();
    // await prisma.transaction.deleteMany();
    // await prisma.product.deleteMany();
    // await prisma.category.deleteMany();
    // await prisma.user.deleteMany();

    // 2. Buat User Dummy
    await prisma.user.upsert({
        where: { email: "user1@example.com" },
        update: {},
        create: {
            name: "Budi Santoso",
            email: "user1@example.com",
        },
    });

    await prisma.user.upsert({
        where: { email: "user2@example.com" },
        update: {},
        create: {
            name: "Siti Aminah",
            email: "user2@example.com",
        },
    });

    // 3. Buat Category Dummy
    const catElektronik = await prisma.category.upsert({
        where: { name: "Elektronik" },
        update: {},
        create: { name: "Elektronik" },
    });

    const catFashion = await prisma.category.upsert({
        where: { name: "Fashion" },
        update: {},
        create: { name: "Fashion" },
    });

    // 4. Buat Product Dummy
    await prisma.product.createMany({
        data: [
            {
                name: "Laptop Gaming X",
                price: 15000000,
                stock: 10,
                categoryId: catElektronik.id,
            },
            {
                name: "Mouse Wireless",
                price: 250000,
                stock: 50,
                categoryId: catElektronik.id,
            },
            {
                name: "Kaos Polos Hitam",
                price: 75000,
                stock: 100,
                categoryId: catFashion.id,
            },
        ],
        skipDuplicates: true, // Hindari error jika dijalankan berulang
    });

    console.log("✅ Seeding Completed!");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });

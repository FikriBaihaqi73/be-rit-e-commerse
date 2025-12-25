import request from "supertest";
import app from "../app";
import jwt from "jsonwebtoken";

describe("GET /api/v1/products", () => {
    const token = jwt.sign({ id: 1, role: "USER" }, process.env.JWT_SECRET || "secret_kunci_rahasia");

    it("should return 401 if no token provided", async () => {
        const res = await request(app).get("/api/v1/products");

        expect(res.statusCode).toEqual(401);
        expect(res.body.success).toBe(false);
    });

    it("should return 200 and list of products", async () => {
        const res = await request(app)
            .get("/api/v1/products")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
    });
});

describe("GET /products/stats", () => {
    const token = jwt.sign({ id: 1, role: "USER" }, process.env.JWT_SECRET || "secret_kunci_rahasia");

    it("should return 401 if no token provided", async () => {
        const res = await request(app).get("/api/v1/products/stats");

        expect(res.statusCode).toEqual(401);
        expect(res.body.success).toBe(false);
    });

    it("should return 200 and product stats", async () => {
        const res = await request(app)
            .get("/api/v1/products/stats")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('overview');
        expect(res.body.data).toHaveProperty('byCategory');
    });
});

describe("POST /api/v1/products", () => {
    const token = jwt.sign({ id: 1, role: "USER" }, process.env.JWT_SECRET || "secret_kunci_rahasia");

    it("should return 401 if no token provided", async () => {
        const res = await request(app).post("/api/v1/products");

        expect(res.statusCode).toEqual(401);
        expect(res.body.success).toBe(false);
    });

    it("should return 201 when provided valid data", async () => {
        // Catatan: Pastikan categoryId: 1 ada di database atau ganti sesuai data di seed
        const res = await request(app)
            .post("/api/v1/products")
            .set("Authorization", `Bearer ${token}`)
            .field("name", "Produk Keren")
            .field("price", 50000)
            .field("stock", 5)
            .field("categoryId", 1)
            .attach("image", Buffer.from("dummy-image"), "test.jpg");

        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBe(true);
    });
});

import prisma from "../database";
afterAll(async () => {
    await prisma.$disconnect();
});
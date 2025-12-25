import request from "supertest";
import app from "../app";
// import jwt from "jsonwebtoken";

describe("POST /api/v1/auth/register", () => {
    it("should return 201 when provided valid data", async () => {
        const res = await request(app)
            .post("/api/v1/auth/register")
            .send({
                name: "John Doe",
                email: "john.doe@example.com",
                password: "password123",
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBe(true);
    });
});

describe("POST /api/v1/auth/login", () => {
    it("should return 200 when provided valid data", async () => {
        const res = await request(app)
            .post("/api/v1/auth/login")
            .send({
                email: "john.doe@example.com",
                password: "password123",
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
    });
});


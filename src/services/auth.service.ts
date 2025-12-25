import prisma from "../prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import type { User } from "../generated/client";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

export const register = async (data: { name: string; email: string; password: string, role?: string }) => {
    // cek apakah email sudah terdaftar
    const exitingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (exitingUser) {
        throw new Error("Email sudah terdaftar");
    }

    // hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // simpan ke database
    return await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: data.role || "USER",
        },
    });
}


export const login = async (data: { email: string; password: string }) => {
    // cari user
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
        throw new Error("Email atau password salah");
    }

    // cek password
    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) {
        throw new Error("Email atau password salah");
    }

    // generate token
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
}
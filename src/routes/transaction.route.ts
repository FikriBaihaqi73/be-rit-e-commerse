import { Router } from "express";
import * as transactionController from "../controllers/transaction.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Transaction
 *   description: Manajemen transaksi
 */

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Checkout transaksi
 *     tags: [Transaction]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: number
 *                 example: 1
 *               quantity:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: Transaksi berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   example: 1
 *                 productId:
 *                   type: number
 *                   example: 1
 *                 quantity:
 *                   type: number
 *                   example: 1
 *                 createdAt:
 *                   type: string
 *                   example: 2022-01-01T00:00:00.000Z
 *                 updatedAt:
 *                   type: string
 *                   example: 2022-01-01T00:00:00.000Z
 */
router.post("/transactions", authenticate, transactionController.checkout);

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Get detail transaksi
 *     tags: [Transaction]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Detail transaksi berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   example: 1
 *                 productId:
 *                   type: number
 *                   example: 1
 *                 quantity:
 *                   type: number
 *                   example: 1
 *                 createdAt:
 *                   type: string
 *                   example: 2022-01-01T00:00:00.000Z
 *                 updatedAt:
 *                   type: string
 *                   example: 2022-01-01T00:00:00.000Z
 */
router.get("/transactions/:id", authenticate, transactionController.getDetail);

export default router;

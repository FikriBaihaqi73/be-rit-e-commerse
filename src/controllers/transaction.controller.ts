import type { Request, Response } from "express";
import * as transactionService from "../services/transaction.service";

export const checkout = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { items } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await transactionService.checkout(userId, items);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Checkout failed" });
    }
  }
};

export const getDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Transaction ID is required" });
    const result = await transactionService.getTransactionById(Number(id));
    if (!result) return res.status(404).json({ message: "Transaction not found" });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error retrieval" });
  }
};
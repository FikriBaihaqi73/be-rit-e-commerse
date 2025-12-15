import { Router } from "express";
import * as transactionController from "../controllers/transaction.controller";

const router = Router();

router.post("/transactions", transactionController.checkout);
router.get("/transactions/:id", transactionController.getDetail);

export default router;

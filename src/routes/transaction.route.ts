import { Router } from "express";
import * as transactionController from "../controllers/transaction.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/transactions", authenticate, transactionController.checkout);
router.get("/transactions/:id", authenticate, transactionController.getDetail);

export default router;

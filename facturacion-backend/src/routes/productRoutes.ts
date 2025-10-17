import { Router } from "express";
import {
  createProduct,
  getMyProducts,
  getProductByCode,
  deleteProduct
} from "../controllers/productController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

router.route("/").post(protect, createProduct).get(protect, getMyProducts);

router.get("/:code", protect, getProductByCode);

router.route('/:id').delete(protect, deleteProduct);

export default router;

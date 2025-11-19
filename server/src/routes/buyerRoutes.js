// src/routes/buyerRoutes.js
import express from "express";
import {
  viewProducts,
  getProductDetails,
} from "../controllers/buyerController.js";
import { requireClerkAuth } from "../middleware/clerkMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public routes: allow viewing products without authentication so product
// details/pages can be opened by any visitor. Routes that require buyer
// authentication should apply the middleware individually (not globally).

/**
 * @swagger
 * /api/buyer/products:
 *   get:
 *     summary: View all products (Buyer)
 *     tags:
 *       - Buyer
 *     responses:
 *       200:
 *         description: List of available products
 */
router.get("/products", viewProducts);

/**
 * @swagger
 * /api/buyer/products/{id}:
 *   get:
 *     summary: View product details (Buyer)
 *     tags:
 *       - Buyer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product details
 */
router.get("/products/:id", getProductDetails);

export default router;

// src/routes/adminRoutes.js
import express from "express";
import { 
  getProducts, 
  getProduct, 
  updateProductById, 
  removeProduct 
} from "../controllers/adminController.js";
import { requireClerkAuth } from "../middleware/clerkMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(requireClerkAuth, authorize("admin"));

/**
 * @swagger
 * /api/admin/products:
 *   get:
 *     summary: Get all products (Admin)
 *     tags:
 *       - Admin
 *     responses:
 *       200:
 *         description: List of all products
 */
router.get("/products", getProducts);

/**
 * @swagger
 * /api/admin/products/{productId}:
 *   get:
 *     summary: Get a product by ID (Admin)
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */
router.get("/products/:productId", getProduct);

/**
 * @swagger
 * /api/admin/products/{productId}:
 *   put:
 *     summary: Update a product by ID (Admin)
 *     description: Admins can update any product regardless of who created it
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               image_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 */
router.put("/products/:productId", updateProductById);

/**
 * @swagger
 * /api/admin/products/{productId}:
 *   delete:
 *     summary: Delete a product by ID (Admin)
 *     description: Admins can delete any product regardless of who created it
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete("/products/:productId", removeProduct);

export default router;
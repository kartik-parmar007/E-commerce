// src/routes/sellerRoutes.js
import express from "express";
import { 
  addProduct, 
  getMyProducts, 
  viewAllProducts,
  updateMyProduct,
  deleteMyProduct 
} from "../controllers/sellerController.js";
import { requireClerkAuth } from "../middleware/clerkMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.use(requireClerkAuth, authorize("seller"));

/**
 * @swagger
 * /api/seller/products:
 *   post:
 *     summary: Add a product with file upload (Seller)
 *     tags:
 *       - Seller
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               stock:
 *                 type: integer
 *               media:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product added successfully
 */
router.post("/products", upload.single('media'), addProduct);

/**
 * @swagger
 * /api/seller/products/my:
 *   get:
 *     summary: View seller's own products
 *     tags:
 *       - Seller
 *     responses:
 *       200:
 *         description: List of seller's products
 */
router.get("/products/my", getMyProducts);

/**
 * @swagger
 * /api/seller/products/all:
 *   get:
 *     summary: View all products in marketplace
 *     tags:
 *       - Seller
 *     responses:
 *       200:
 *         description: List of all products
 */
router.get("/products/all", viewAllProducts);

/**
 * @swagger
 * /api/seller/products/{id}:
 *   put:
 *     summary: Update seller's product with file upload
 *     tags:
 *       - Seller
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               stock:
 *                 type: integer
 *               media:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully
 */
router.put("/products/:id", upload.single('media'), updateMyProduct);

/**
 * @swagger
 * /api/seller/products/{id}:
 *   delete:
 *     summary: Delete seller's product
 *     tags:
 *       - Seller
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted successfully
 */
router.delete("/products/:id", deleteMyProduct);

export default router;

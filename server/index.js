// index.js
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import adminRoutes from "./src/routes/adminRoutes.js";
import sellerRoutes from "./src/routes/sellerRoutes.js";
import buyerRoutes from "./src/routes/buyerRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import { setupSwagger } from "./src/swagger/swagger.js";
import { requireClerkAuth } from "./src/middleware/clerkMiddleware.js";
import { authorize } from "./src/middleware/roleMiddleware.js";
import { createUsersTable } from "./src/models/userModel.js";
import { createProductsTable } from "./src/models/productModel.js";
const app = express();
app.use(express.json());

// Optional: CORS if frontend is on a different origin
import cors from "cors";
app.use(cors());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Initialize database tables
await createUsersTable();
await createProductsTable();

// Public routes
app.use("/api/auth", authRoutes);

// Admin routes (only accessible to admin role)
app.use("/api/admin", requireClerkAuth, authorize("admin"), adminRoutes);

// Seller routes (only accessible to seller role)
app.use("/api/seller", requireClerkAuth, authorize("seller"), sellerRoutes);

// Buyer routes
// Product listing and product detail endpoints are public so visitors can
// view products without signing in. If you need to protect specific buyer
// actions, apply `requireClerkAuth` and `authorize('buyer')` on those routes
// inside `buyerRoutes` instead of here at mount time.
app.use("/api/buyer", buyerRoutes);

// Swagger setup
setupSwagger(app); // Swagger UI available at /api-docs

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
});

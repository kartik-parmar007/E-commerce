// authRoutes.js
import express from "express";
import {
  registerUser,
  getCurrentUser,
  getUserRoleController,
  handleClerkWebhook,
} from "../controllers/authController.js";
import { requireClerkAuth } from "../middleware/clerkMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user with role (buyer/seller)
 * @access  Public
 */
router.post("/register", registerUser);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get("/me", requireClerkAuth, getCurrentUser);

/**
 * @route   GET /api/auth/role
 * @desc    Get current user role
 * @access  Private
 */
router.get("/role", requireClerkAuth, getUserRoleController);

/**
 * @route   POST /api/auth/webhook
 * @desc    Clerk webhook endpoint
 * @access  Public (but should be verified with Clerk signature)
 */
router.post("/webhook", handleClerkWebhook);

export default router;

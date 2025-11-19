// authController.js
import { createUser, getUserByClerkId, getUserRole } from "../models/userModel.js";
import { clerkClient } from "../middleware/clerkMiddleware.js";

// Admin email constant
const ADMIN_EMAIL = "kartikparmar9773@gmail.com";

/**
 * Register a new user with a specific role (buyer or seller)
 * Admins are not registered through this endpoint but are identified by email
 */
export const registerUser = async (req, res) => {
  try {
    const { clerkUserId, email, role, firstName, lastName } = req.body;

    // Validate required fields
    if (!clerkUserId || !email || !role) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: clerkUserId, email, and role are required",
      });
    }

    // Prevent users from registering as admin through this endpoint
    if (role === "admin") {
      return res.status(400).json({
        success: false,
        message: "Admin role cannot be assigned through registration. Admins are identified by email.",
      });
    }

    // Validate role
    if (!["buyer", "seller"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be 'buyer' or 'seller'",
      });
    }

    // Create user in database
    const user = await createUser(clerkUserId, email, role, firstName, lastName);

    // Update Clerk user metadata with role
    try {
      await clerkClient.users.updateUser(clerkUserId, {
        publicMetadata: {
          role: role,
        },
      });
    } catch (clerkError) {
      console.error("Error updating Clerk metadata:", clerkError);
      // Continue even if Clerk update fails - user is created in DB
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({
      success: false,
      message: "Failed to register user",
      error: error.message,
    });
  }
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;

    if (!clerkUserId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Check if user is admin by email
    const clerkUser = await clerkClient.users.getUser(clerkUserId);
    const userEmail = clerkUser.primaryEmailAddress?.emailAddress;
    
    if (userEmail === ADMIN_EMAIL) {
      return res.status(200).json({
        success: true,
        data: {
          ...clerkUser,
          role: "admin"
        },
      });
    }

    const user = await getUserByClerkId(clerkUserId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user profile",
      error: error.message,
    });
  }
};

/**
 * Get user role
 */
export const getUserRoleController = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;

    if (!clerkUserId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Check if user is admin by email
    const clerkUser = await clerkClient.users.getUser(clerkUserId);
    const userEmail = clerkUser.primaryEmailAddress?.emailAddress;
    
    if (userEmail === ADMIN_EMAIL) {
      return res.status(200).json({
        success: true,
        data: { role: "admin" },
      });
    }

    const role = await getUserRole(clerkUserId);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "User role not found",
      });
    }

    res.status(200).json({
      success: true,
      data: { role },
    });
  } catch (error) {
    console.error("Error in getUserRoleController:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user role",
      error: error.message,
    });
  }
};

/**
 * Webhook handler for Clerk events (optional - for automatic user creation)
 */
export const handleClerkWebhook = async (req, res) => {
  try {
    const { type, data } = req.body;

    // Handle user.created event
    if (type === "user.created") {
      const { id, email_addresses, first_name, last_name, public_metadata } = data;
      
      const email = email_addresses[0]?.email_address;
      let role = public_metadata?.role || "buyer"; // Default to buyer
      
      // If user has admin email, set role to admin
      if (email === ADMIN_EMAIL) {
        role = "admin";
      }

      await createUser(id, email, role, first_name, last_name);
      
      console.log(`✅ User created via webhook: ${email} (${role})`);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in handleClerkWebhook:", error);
    res.status(500).json({
      success: false,
      message: "Webhook processing failed",
      error: error.message,
    });
  }
};
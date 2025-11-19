// roleMiddleware.js
import { getUserRole } from "../models/userModel.js";
import { clerkClient } from "./clerkMiddleware.js";

// Admin email constant
const ADMIN_EMAIL = "kartikparmar9773@gmail.com";

/**
 * Authorize user based on role from database
 * Special handling for admin users identified by email
 */
export const authorize = (requiredRole) => async (req, res, next) => {
  try {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({ 
        success: false,
        message: "Unauthorized - Please sign in" 
      });
    }

    // For admin role requirement, check if user has admin email
    if (requiredRole === "admin") {
      // Get user email from Clerk
      const clerkUser = await clerkClient.users.getUser(req.auth.userId);
      const userEmail = clerkUser.primaryEmailAddress?.emailAddress;
      
      // If user has the admin email, allow access
      if (userEmail === ADMIN_EMAIL) {
        req.userRole = "admin";
        return next();
      }
    }

    // Get user role from database for non-admin checks or non-admin users
    const userRole = await getUserRole(req.auth.userId);

    if (!userRole) {
      return res.status(403).json({ 
        success: false,
        message: "Forbidden - No role assigned. Please complete registration." 
      });
    }

    // Check if user has required role
    if (userRole !== requiredRole) {
      return res.status(403).json({ 
        success: false,
        message: `Forbidden - ${requiredRole} role required` 
      });
    }

    // Attach user role to request object
    req.userRole = userRole;
    next();
  } catch (error) {
    console.error("Error in authorize middleware:", error);
    res.status(500).json({ 
      success: false,
      message: "Authorization error",
      error: error.message 
    });
  }
};

/**
 * Check if user has any of the specified roles
 * Special handling for admin users identified by email
 */
export const authorizeRoles = (...allowedRoles) => async (req, res, next) => {
  try {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({ 
        success: false,
        message: "Unauthorized - Please sign in" 
      });
    }

    // Check if admin role is allowed and user has admin email
    if (allowedRoles.includes("admin")) {
      // Get user email from Clerk
      const clerkUser = await clerkClient.users.getUser(req.auth.userId);
      const userEmail = clerkUser.primaryEmailAddress?.emailAddress;
      
      // If user has the admin email, allow access
      if (userEmail === ADMIN_EMAIL) {
        req.userRole = "admin";
        return next();
      }
    }

    const userRole = await getUserRole(req.auth.userId);

    if (!userRole) {
      return res.status(403).json({ 
        success: false,
        message: "Forbidden - No role assigned" 
      });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        success: false,
        message: `Forbidden - One of these roles required: ${allowedRoles.join(", ")}` 
      });
    }

    req.userRole = userRole;
    next();
  } catch (error) {
    console.error("Error in authorizeRoles middleware:", error);
    res.status(500).json({ 
      success: false,
      message: "Authorization error",
      error: error.message 
    });
  }
};
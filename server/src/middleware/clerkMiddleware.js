// clerkMiddleware.js
import { clerkClient, requireAuth } from "@clerk/express";

export const requireClerkAuth = requireAuth();
export { clerkClient };

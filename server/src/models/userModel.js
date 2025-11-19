// userModel.js
import pool from "../config/db.js";

/**
 * Create users table if not exists
 */
export const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clerk_user_id TEXT UNIQUE NOT NULL,
      email TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('buyer', 'seller', 'admin')),
      first_name TEXT,
      last_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_clerk_user_id ON users(clerk_user_id);
    CREATE INDEX IF NOT EXISTS idx_role ON users(role);
  `;

  try {
    await pool.query(query);
    console.log("✅ Users table ready");
  } catch (error) {
    console.error("❌ Error creating users table:", error);
    throw error;
  }
};

/**
 * Create a new user with role
 */
export const createUser = async (clerkUserId, email, role, firstName = null, lastName = null) => {
  const query = `
    INSERT INTO users (clerk_user_id, email, role, first_name, last_name)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(clerk_user_id) DO UPDATE SET 
      email = excluded.email,
      role = excluded.role,
      first_name = excluded.first_name,
      last_name = excluded.last_name,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *;
  `;

  try {
    // For SQLite, we need to handle the upsert differently
    // First try to update
    const updateQuery = `
      UPDATE users 
      SET email = ?, role = ?, first_name = ?, last_name = ?, updated_at = CURRENT_TIMESTAMP
      WHERE clerk_user_id = ?
    `;
    const updateResult = await pool.query(updateQuery, [email, role, firstName, lastName, clerkUserId]);
    
    // If no rows were updated, insert
    if (updateResult.rowCount === 0) {
      const insertQuery = `
        INSERT INTO users (clerk_user_id, email, role, first_name, last_name)
        VALUES (?, ?, ?, ?, ?)
      `;
      await pool.query(insertQuery, [clerkUserId, email, role, firstName, lastName]);
    }
    
    // Get the user data
    const selectQuery = "SELECT * FROM users WHERE clerk_user_id = ?";
    const result = await pool.query(selectQuery, [clerkUserId]);
    return result.rows[0];
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

/**
 * Get user by Clerk user ID
 */
export const getUserByClerkId = async (clerkUserId) => {
  const query = "SELECT * FROM users WHERE clerk_user_id = ?";
  
  try {
    const result = await pool.query(query, [clerkUserId]);
    return result.rows[0];
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

/**
 * Get user role by Clerk user ID
 */
export const getUserRole = async (clerkUserId) => {
  const query = "SELECT role FROM users WHERE clerk_user_id = ?";
  
  try {
    const result = await pool.query(query, [clerkUserId]);
    return result.rows[0]?.role;
  } catch (error) {
    console.error("Error getting user role:", error);
    throw error;
  }
};

/**
 * Update user role
 */
export const updateUserRole = async (clerkUserId, newRole) => {
  const query = `
    UPDATE users 
    SET role = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE clerk_user_id = ?
    RETURNING *;
  `;

  try {
    await pool.query(query, [newRole, clerkUserId]);
    const selectQuery = "SELECT * FROM users WHERE clerk_user_id = ?";
    const result = await pool.query(selectQuery, [clerkUserId]);
    return result.rows[0];
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};

/**
 * Get all users by role
 */
export const getUsersByRole = async (role) => {
  const query = "SELECT * FROM users WHERE role = ? ORDER BY created_at DESC";
  
  try {
    const result = await pool.query(query, [role]);
    return result.rows;
  } catch (error) {
    console.error("Error getting users by role:", error);
    throw error;
  }
};

/**
 * Delete user
 */
export const deleteUser = async (clerkUserId) => {
  const query = "DELETE FROM users WHERE clerk_user_id = ? RETURNING *";
  
  try {
    const selectQuery = "SELECT * FROM users WHERE clerk_user_id = ?";
    const userResult = await pool.query(selectQuery, [clerkUserId]);
    const user = userResult.rows[0];
    
    await pool.query(query, [clerkUserId]);
    return user;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
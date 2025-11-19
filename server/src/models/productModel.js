import pool from "../config/db.js";

/**
 * Create products table if not exists
 */
export const createProductsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      stock INTEGER DEFAULT 0,
      image_url TEXT,
      seller_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_seller_id ON products(seller_id);
  `;

  try {
    await pool.query(query);
    console.log("✅ Products table ready");
  } catch (error) {
    console.error("❌ Error creating products table:", error);
    throw error;
  }
};

/**
 * Create a new product
 */
export const createProduct = async ({
  name,
  description,
  price,
  stock,
  image_url,
  seller_id,
}) => {
  const result = await pool.query(
    "INSERT INTO products (name, description, price, stock, image_url, seller_id) VALUES (?, ?, ?, ?, ?, ?) RETURNING *",
    [name, description, price, stock || 0, image_url, seller_id]
  );
  return result.rows[0];
};

/**
 * Get all products
 */
export const getAllProducts = async () => {
  const result = await pool.query(
    "SELECT * FROM products ORDER BY created_at DESC"
  );
  return result.rows;
};

/**
 * Get products by seller ID
 */
export const getProductsBySellerId = async (sellerId) => {
  const result = await pool.query(
    "SELECT * FROM products WHERE seller_id = ? ORDER BY created_at DESC",
    [sellerId]
  );
  return result.rows;
};

/**
 * Get product by ID
 */
export const getProductById = async (productId) => {
  // Join with users table to include seller's name/email in the product response
  const result = await pool.query(
    `SELECT p.*, 
                COALESCE(u.first_name, '') || CASE WHEN u.first_name IS NOT NULL AND u.last_name IS NOT NULL THEN ' ' ELSE '' END || COALESCE(u.last_name, '') AS seller_name,
                u.email AS seller_email
         FROM products p
         LEFT JOIN users u ON p.seller_id = u.clerk_user_id
         WHERE p.id = ?`,
    [productId]
  );

  return result.rows[0];
};

/**
 * Update product
 */
export const updateProduct = async (
  productId,
  { name, description, price, stock, image_url }
) => {
  const result = await pool.query(
    `UPDATE products 
         SET name = COALESCE(?, name), 
             description = COALESCE(?, description), 
             price = COALESCE(?, price), 
             stock = COALESCE(?, stock),
             image_url = COALESCE(?, image_url),
             updated_at = CURRENT_TIMESTAMP 
         WHERE id = ? 
         RETURNING *`,
    [name, description, price, stock, image_url, productId]
  );
  return result.rows[0];
};

/**
 * Delete product
 */
export const deleteProduct = async (productId) => {
  const result = await pool.query(
    "DELETE FROM products WHERE id = ? RETURNING *",
    [productId]
  );
  return result.rows[0];
};
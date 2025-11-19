import pool from "./src/config/db.js";

async function checkProducts() {
  try {
    const result = await pool.query('SELECT * FROM products');
    console.log("Products in database:", result.rows);
  } catch (error) {
    console.error("Error querying products:", error);
  } finally {
    await pool.end();
  }
}

checkProducts();
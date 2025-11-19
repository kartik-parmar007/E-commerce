import { createProduct } from "./src/models/productModel.js";
import pool from "./src/config/db.js";

// Add a test product
async function addTestProduct() {
  try {
    const product = await createProduct({
      name: "Test Product",
      description: "This is a test product for debugging purposes",
      price: 29.99,
      stock: 10,
      image_url: null,
      seller_id: "test_seller_id"
    });
    
    console.log("Test product created:", product);
  } catch (error) {
    console.error("Error creating test product:", error);
  } finally {
    await pool.end();
  }
}

addTestProduct();
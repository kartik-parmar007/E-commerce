import { 
  getAllProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct 
} from "../models/productModel.js";

/**
 * Get all products (Admin)
 */
export const getProducts = async (req, res) => {
  try {
    const products = await getAllProducts();
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message
    });
  }
};

/**
 * Get a specific product by ID (Admin)
 */
export const getProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Convert string ID to integer
    const id = parseInt(productId, 10);
    
    // Validate that ID is a valid integer
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }
    
    const product = await getProductById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message
    });
  }
};

/**
 * Update a product (Admin)
 * Admins can update any product regardless of who created it
 */
export const updateProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, description, price, stock, image_url } = req.body;
    
    // Convert string ID to integer
    const id = parseInt(productId, 10);
    
    // Validate that ID is a valid integer
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }
    
    // Check if product exists
    const existingProduct = await getProductById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const updatedProduct = await updateProduct(id, {
      name,
      description,
      price,
      stock,
      image_url
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message
    });
  }
};

/**
 * Delete a product (Admin)
 * Admins can delete any product regardless of who created it
 */
export const removeProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Convert string ID to integer
    const id = parseInt(productId, 10);
    
    // Validate that ID is a valid integer
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }
    
    const deletedProduct = await deleteProduct(id);
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: deletedProduct
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message
    });
  }
};
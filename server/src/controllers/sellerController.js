import { 
  createProduct, 
  getAllProducts, 
  getProductsBySellerId, 
  getProductById,
  updateProduct,
  deleteProduct 
} from "../models/productModel.js";

/**
 * Create a new product (Seller only)
 */
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    const seller_id = req.auth.userId; // Get seller ID from authenticated user

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Name and price are required"
      });
    }

    // Get uploaded file path
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const product = await createProduct({
      name,
      description,
      price,
      stock,
      image_url,
      seller_id
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message
    });
  }
};

/**
 * Get all seller's own products
 */
export const getMyProducts = async (req, res) => {
  try {
    const seller_id = req.auth.userId;
    const products = await getProductsBySellerId(seller_id);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error("Error fetching seller products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message
    });
  }
};

/**
 * Get all products (for sellers to view marketplace)
 */
export const viewAllProducts = async (req, res) => {
  try {
    const products = await getAllProducts();

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error("Error fetching all products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message
    });
  }
};

/**
 * Update seller's own product
 */
export const updateMyProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const seller_id = req.auth.userId;
    const { name, description, price, stock } = req.body;

    // Check if product exists and belongs to seller
    const existingProduct = await getProductById(id);
    
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (existingProduct.seller_id !== seller_id) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own products"
      });
    }

    // Get uploaded file path or keep existing
    const image_url = req.file ? `/uploads/${req.file.filename}` : undefined;

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
 * Delete seller's own product
 */
export const deleteMyProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const seller_id = req.auth.userId;

    // Check if product exists and belongs to seller
    const existingProduct = await getProductById(id);
    
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (existingProduct.seller_id !== seller_id) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own products"
      });
    }

    await deleteProduct(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
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

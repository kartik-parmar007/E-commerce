import { getAllProducts, getProductById } from "../models/productModel.js";

/**
 * Get all available products for buyers
 */
export const viewProducts = async (req, res) => {
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
 * Get single product details
 */
export const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    // Convert string ID to integer
    const productId = parseInt(id, 10);
    
    // Validate that ID is a valid integer
    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }
    
    const product = await getProductById(productId);

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
    console.error("Error fetching product details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product details",
      error: error.message
    });
  }
};

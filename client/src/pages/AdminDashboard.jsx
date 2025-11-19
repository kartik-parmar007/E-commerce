import { useState, useEffect } from "react";
import { useAuth, useUser, UserButton, SignedIn } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminDashboard() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image_url: ""
  });
  const [message, setMessage] = useState("");

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/admin/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setMessage("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle delete product
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/admin/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage("Product deleted successfully");
        fetchProducts(); // Refresh the product list
      } else {
        setMessage(data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setMessage("Failed to delete product");
    }
  };

  // Handle edit product
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsEditing(true);
    setEditForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      stock: product.stock || 0,
      image_url: product.image_url || ""
    });
  };

  // Handle update product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/admin/products/${selectedProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editForm.name,
          description: editForm.description,
          price: parseFloat(editForm.price),
          stock: parseInt(editForm.stock),
          image_url: editForm.image_url
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage("Product updated successfully");
        setIsEditing(false);
        setSelectedProduct(null);
        fetchProducts(); // Refresh the product list
      } else {
        setMessage(data.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setMessage("Failed to update product");
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
    setSelectedProduct(null);
    setEditForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      image_url: ""
    });
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Navigation Header */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: "1rem 2rem",
          backgroundColor: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <h1 style={{ margin: 0, fontSize: "1.5rem", color: "#4F46E5" }}>
            🔐 Admin Dashboard
          </h1>
          <nav style={{ display: "flex", gap: "1rem" }}>
            <Link
              to="/"
              style={{
                padding: "0.5rem 1rem",
                color: "#666",
                textDecoration: "none",
                borderRadius: "6px",
                fontWeight: "500",
              }}
            >
              Home
            </Link>
          </nav>
        </div>
        <SignedIn>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ color: "#666", fontSize: "0.9rem" }}>
              {user?.primaryEmailAddress?.emailAddress}
            </span>
            <UserButton />
          </div>
        </SignedIn>
      </header>

      {/* Main Content */}
      <div style={{ padding: "6rem 2rem 2rem 2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <h2 style={{ color: "#333", marginBottom: "0.5rem" }}>Admin Dashboard</h2>
          <p style={{ color: "#666" }}>Manage all products in the system</p>
        </div>

        {/* Message Display */}
        {message && (
          <div 
            style={{ 
              padding: "1rem", 
              marginBottom: "1rem", 
              borderRadius: "6px", 
              backgroundColor: message.includes("Failed") ? "#FEE2E2" : "#D1FAE5",
              color: message.includes("Failed") ? "#B91C1C" : "#065F46",
              textAlign: "center"
            }}
          >
            {message}
          </div>
        )}

        {/* Edit Product Form */}
        {isEditing && selectedProduct && (
          <div 
            style={{ 
              backgroundColor: "white", 
              borderRadius: "8px", 
              padding: "2rem", 
              marginBottom: "2rem",
              boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
            }}
          >
            <h3 style={{ margin: "0 0 1.5rem 0" }}>Edit Product</h3>
            <form onSubmit={handleUpdateProduct}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    fontSize: "1rem"
                  }}
                  required
                />
              </div>
              
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    fontSize: "1rem",
                    minHeight: "100px"
                  }}
                />
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                    Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={editForm.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "6px",
                      border: "1px solid #d1d5db",
                      fontSize: "1rem"
                    }}
                    required
                  />
                </div>
                
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={editForm.stock}
                    onChange={handleInputChange}
                    min="0"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "6px",
                      border: "1px solid #d1d5db",
                      fontSize: "1rem"
                    }}
                    required
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                  Image URL
                </label>
                <input
                  type="text"
                  name="image_url"
                  value={editForm.image_url}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    fontSize: "1rem"
                  }}
                />
              </div>
              
              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  type="submit"
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#4F46E5",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "500",
                    fontSize: "1rem",
                  }}
                >
                  Update Product
                </button>
                <button
                  type="button"
                  onClick={cancelEditing}
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#e5e7eb",
                    color: "#374151",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "500",
                    fontSize: "1rem",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        <div>
          <h2 style={{ marginBottom: "1.5rem" }}>
            All Products ({products.length})
          </h2>

          {loading ? (
            <p style={{ textAlign: "center", padding: "3rem" }}>Loading products...</p>
          ) : products.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666", padding: "3rem" }}>
              No products available
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "1rem",
                    backgroundColor: "white",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {product.image_url ? (
                    product.image_url.match(/\.(mp4|mov|webm|mpeg)$/i) ? (
                      <video
                        src={`${API_URL}${product.image_url}`}
                        controls
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                          borderRadius: "6px",
                          marginBottom: "1rem",
                        }}
                      />
                    ) : (
                      <img
                        src={`${API_URL}${product.image_url}`}
                        alt={product.name}
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                          borderRadius: "6px",
                          marginBottom: "1rem",
                        }}
                      />
                    )
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "200px",
                        backgroundColor: "#f3f4f6",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "1rem",
                        color: "#9ca3af",
                        fontSize: "3rem",
                      }}
                    >
                      📦
                    </div>
                  )}

                  <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.125rem" }}>
                    {product.name}
                  </h3>

                  <p
                    style={{
                      color: "#666",
                      fontSize: "0.875rem",
                      marginBottom: "0.75rem",
                      minHeight: "40px",
                    }}
                  >
                    {product.description || "No description available"}
                  </p>

                  <div style={{ marginBottom: "1rem" }}>
                    <p
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "bold",
                        color: "#4F46E5",
                        margin: "0.5rem 0",
                      }}
                    >
                      ${parseFloat(product.price).toFixed(2)}
                    </p>

                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: product.stock > 0 ? "#10B981" : "#EF4444",
                        fontWeight: "500",
                      }}
                    >
                      {product.stock > 0
                        ? `${product.stock} in stock`
                        : "Out of stock"}
                    </p>
                    
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#666",
                        fontWeight: "500",
                        marginTop: "0.5rem",
                      }}
                    >
                      Seller: {product.seller_name || product.seller_email || product.seller_id}
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => handleEditProduct(product)}
                      style={{
                        flex: 1,
                        padding: "0.5rem",
                        backgroundColor: "#F59E0B",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "500",
                        fontSize: "0.875rem",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      style={{
                        flex: 1,
                        padding: "0.5rem",
                        backgroundColor: "#EF4444",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "500",
                        fontSize: "0.875rem",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
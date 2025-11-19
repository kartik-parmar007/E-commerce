import { useState, useEffect } from "react";
import { useAuth, useUser, UserButton, SignedIn } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { useRegisterUser } from "../hooks/useRegisterUser";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function SellerDashboard() {
  const { getToken } = useAuth();
  const { user } = useUser();
  
  // Auto-register user as seller if not already registered
  const { isRegistered, error: registrationError } = useRegisterUser("seller");
  
  const [activeTab, setActiveTab] = useState("my-products");
  const [myProducts, setMyProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  // Fetch my products
  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/seller/products/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setMyProducts(data.data);
      }
    } catch (error) {
      console.error("Error fetching my products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all products
  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/seller/products/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setAllProducts(data.data);
      }
    } catch (error) {
      console.error("Error fetching all products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "my-products") {
      fetchMyProducts();
    } else if (activeTab === "all-products") {
      fetchAllProducts();
    }
  }, [activeTab]);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      const url = editingProduct
        ? `${API_URL}/api/seller/products/${editingProduct.id}`
        : `${API_URL}/api/seller/products`;
      
      const method = editingProduct ? "PUT" : "POST";

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('stock', formData.stock || 0);
      
      if (mediaFile) {
        formDataToSend.append('media', mediaFile);
      }

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();
      
      if (data.success) {
        alert(editingProduct ? "Product updated!" : "Product created!");
        setFormData({ name: "", description: "", price: "", stock: "" });
        setMediaFile(null);
        setMediaPreview(null);
        setShowAddForm(false);
        setEditingProduct(null);
        fetchMyProducts();
      } else {
        alert(data.message || "Failed to save product");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving product");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/seller/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        alert("Product deleted!");
        fetchMyProducts();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product");
    }
  };

  // Handle edit
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      stock: product.stock || 0,
    });
    setMediaFile(null);
    setMediaPreview(product.image_url ? `${API_URL}${product.image_url}` : null);
    setShowAddForm(true);
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
            🏪 Seller Portal
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
          <h2 style={{ color: "#333", marginBottom: "0.5rem" }}>Seller Dashboard</h2>
          <p style={{ color: "#666" }}>Welcome, {user?.firstName || "Seller"}!</p>
        </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", borderBottom: "2px solid #e5e7eb" }}>
        <button
          onClick={() => setActiveTab("my-products")}
          style={{
            padding: "1rem 2rem",
            border: "none",
            background: "none",
            cursor: "pointer",
            borderBottom: activeTab === "my-products" ? "3px solid #4F46E5" : "none",
            color: activeTab === "my-products" ? "#4F46E5" : "#666",
            fontWeight: activeTab === "my-products" ? "bold" : "normal",
          }}
        >
          My Products
        </button>
        <button
          onClick={() => setActiveTab("all-products")}
          style={{
            padding: "1rem 2rem",
            border: "none",
            background: "none",
            cursor: "pointer",
            borderBottom: activeTab === "all-products" ? "3px solid #4F46E5" : "none",
            color: activeTab === "all-products" ? "#4F46E5" : "#666",
            fontWeight: activeTab === "all-products" ? "bold" : "normal",
          }}
        >
          All Products
        </button>
      </div>

      {/* My Products Tab */}
      {activeTab === "my-products" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <h2>My Products ({myProducts.length})</h2>
            <button
              onClick={() => {
                setShowAddForm(!showAddForm);
                setEditingProduct(null);
                setFormData({ name: "", description: "", price: "", stock: "" });
                setMediaFile(null);
                setMediaPreview(null);
              }}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#4F46E5",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              {showAddForm ? "Cancel" : "+ Add New Product"}
            </button>
          </div>

          {/* Add/Edit Form */}
          {showAddForm && (
            <form onSubmit={handleSubmit} style={{ marginBottom: "2rem", padding: "1.5rem", backgroundColor: "#f9fafb", borderRadius: "8px" }}>
              <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
              <div style={{ display: "grid", gap: "1rem" }}>
                <input
                  type="text"
                  placeholder="Product Name *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{ padding: "0.75rem", borderRadius: "6px", border: "1px solid #d1d5db" }}
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  style={{ padding: "0.75rem", borderRadius: "6px", border: "1px solid #d1d5db" }}
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price *"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  style={{ padding: "0.75rem", borderRadius: "6px", border: "1px solid #d1d5db" }}
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  style={{ padding: "0.75rem", borderRadius: "6px", border: "1px solid #d1d5db" }}
                />
                
                {/* File Upload Section */}
                <div style={{ marginTop: "0.5rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#374151" }}>
                    Product Image/Video
                  </label>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    style={{
                      padding: "0.75rem",
                      borderRadius: "6px",
                      border: "2px dashed #d1d5db",
                      width: "100%",
                      cursor: "pointer",
                      backgroundColor: "white"
                    }}
                  />
                  <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>
                    Accepted: Images (JPEG, PNG, GIF, WebP) and Videos (MP4, MOV, WebM) - Max 10MB
                  </p>
                </div>

                {/* Media Preview */}
                {mediaPreview && (
                  <div style={{ marginTop: "0.5rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#374151" }}>
                      Preview
                    </label>
                    {mediaFile && mediaFile.type.startsWith('video/') ? (
                      <video
                        src={mediaPreview}
                        controls
                        style={{
                          width: "100%",
                          maxHeight: "300px",
                          borderRadius: "6px",
                          objectFit: "contain",
                          backgroundColor: "#000"
                        }}
                      />
                    ) : (
                      <img
                        src={mediaPreview}
                        alt="Preview"
                        style={{
                          width: "100%",
                          maxHeight: "300px",
                          borderRadius: "6px",
                          objectFit: "contain"
                        }}
                      />
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  style={{
                    padding: "0.75rem",
                    backgroundColor: "#10B981",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                >
                  {editingProduct ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          )}

          {/* Products Grid */}
          {loading ? (
            <p>Loading...</p>
          ) : myProducts.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666", padding: "3rem" }}>No products yet. Create your first product!</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {myProducts.map((product) => (
                <div key={product.id} style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "1rem", backgroundColor: "white" }}>
                  {product.image_url && (
                    product.image_url.match(/\.(mp4|mov|webm|mpeg)$/i) ? (
                      <video
                        src={`${API_URL}${product.image_url}`}
                        controls
                        style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "6px", marginBottom: "1rem", backgroundColor: "#000" }}
                      />
                    ) : (
                      <img
                        src={`${API_URL}${product.image_url}`}
                        alt={product.name}
                        style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "6px", marginBottom: "1rem" }}
                      />
                    )
                  )}
                  <h3 style={{ margin: "0 0 0.5rem 0" }}>{product.name}</h3>
                  <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "0.5rem" }}>{product.description}</p>
                  <p style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#4F46E5", margin: "0.5rem 0" }}>${parseFloat(product.price).toFixed(2)}</p>
                  <p style={{ fontSize: "0.875rem", color: "#666" }}>Stock: {product.stock}</p>
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                    <button
                      onClick={() => handleEdit(product)}
                      style={{
                        flex: 1,
                        padding: "0.5rem",
                        backgroundColor: "#3B82F6",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      style={{
                        flex: 1,
                        padding: "0.5rem",
                        backgroundColor: "#EF4444",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
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
      )}

      {/* All Products Tab */}
      {activeTab === "all-products" && (
        <div>
          <h2>All Products in Marketplace ({allProducts.length})</h2>
          {loading ? (
            <p>Loading...</p>
          ) : allProducts.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666", padding: "3rem" }}>No products available</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem", marginTop: "1.5rem" }}>
              {allProducts.map((product) => (
                <div key={product.id} style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "1rem", backgroundColor: "white" }}>
                  {product.image_url && (
                    product.image_url.match(/\.(mp4|mov|webm|mpeg)$/i) ? (
                      <video
                        src={`${API_URL}${product.image_url}`}
                        controls
                        style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "6px", marginBottom: "1rem", backgroundColor: "#000" }}
                      />
                    ) : (
                      <img
                        src={`${API_URL}${product.image_url}`}
                        alt={product.name}
                        style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "6px", marginBottom: "1rem" }}
                      />
                    )
                  )}
                  <h3 style={{ margin: "0 0 0.5rem 0" }}>{product.name}</h3>
                  <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "0.5rem" }}>{product.description}</p>
                  <p style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#4F46E5", margin: "0.5rem 0" }}>${parseFloat(product.price).toFixed(2)}</p>
                  <p style={{ fontSize: "0.875rem", color: "#666" }}>Stock: {product.stock}</p>
                  <p style={{ fontSize: "0.75rem", color: "#999", marginTop: "0.5rem" }}>Seller ID: {product.seller_id.substring(0, 10)}...</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}

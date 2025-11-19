import { useState, useEffect } from "react";
import { useAuth, useUser, UserButton, SignedIn } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterUser } from "../hooks/useRegisterUser";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function BuyerDashboard() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  
  // Auto-register user as buyer if not already registered
  const { isRegistered, error: registrationError } = useRegisterUser("buyer");
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/buyer/products`, {
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 style={{ margin: 0, fontSize: "1.5rem", color: "#10B981" }}>
            🛒 Buyer Portal
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
            <Link
              to="/cart"
              style={{
                padding: "0.5rem 1rem",
                color: "#10B981",
                textDecoration: "none",
                borderRadius: "6px",
                fontWeight: "500",
              }}
            >
              🛒 Cart
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
          <h2 style={{ color: "#333", marginBottom: "0.5rem" }}>Buyer Dashboard</h2>
          <p style={{ color: "#666" }}>Welcome, {user?.firstName || "Buyer"}! Browse our products</p>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: "2rem" }}>
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "1rem",
              borderRadius: "8px",
              border: "2px solid #e5e7eb",
              fontSize: "1rem",
            }}
          />
        </div>

        {/* Products Grid */}
        <div>
          <h2 style={{ marginBottom: "1.5rem" }}>
            Available Products ({filteredProducts.length})
          </h2>

          {loading ? (
            <p style={{ textAlign: "center", padding: "3rem" }}>Loading products...</p>
          ) : filteredProducts.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666", padding: "3rem" }}>
              {searchTerm ? "No products found matching your search" : "No products available"}
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "1rem",
                    backgroundColor: "white",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    cursor: "pointer",
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
                          cursor: "pointer",
                        }}
                        onClick={() => navigate(`/product/${product.id}`)}
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
                          cursor: "pointer",
                        }}
                        onClick={() => navigate(`/product/${product.id}`)}
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
                        cursor: "pointer",
                      }}
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      📦
                    </div>
                  )}

                  <h3 
                    style={{ 
                      margin: "0 0 0.5rem 0", 
                      fontSize: "1.125rem",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {product.name}
                  </h3>

                  <p
                    style={{
                      color: "#666",
                      fontSize: "0.875rem",
                      marginBottom: "0.75rem",
                      minHeight: "40px",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {product.description || "No description available"}
                  </p>

                  <div style={{ marginBottom: "1rem" }}>
                    <p
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        color: "#10B981",
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
                  </div>

                  <button
                    onClick={() => navigate(`/product/${product.id}`)}
                    disabled={product.stock === 0}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      backgroundColor: product.stock > 0 ? "#10B981" : "#9ca3af",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: product.stock > 0 ? "pointer" : "not-allowed",
                      fontWeight: "500",
                      fontSize: "1rem",
                    }}
                  >
                    {product.stock > 0 ? "🛒 View Details" : "Out of Stock"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div
          style={{
            marginTop: "3rem",
            padding: "2rem",
            backgroundColor: "#f9fafb",
            borderRadius: "8px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.5rem",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#10B981", margin: "0" }}>
              {products.length}
            </p>
            <p style={{ color: "#666", margin: "0.5rem 0 0 0" }}>Total Products</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#10B981", margin: "0" }}>
              {products.filter(p => p.stock > 0).length}
            </p>
            <p style={{ color: "#666", margin: "0.5rem 0 0 0" }}>In Stock</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#10B981", margin: "0" }}>
              $
              {products.length > 0
                ? (
                    products.reduce((sum, p) => sum + parseFloat(p.price), 0) /
                    products.length
                  ).toFixed(2)
                : "0.00"}
            </p>
            <p style={{ color: "#666", margin: "0.5rem 0 0 0" }}>Average Price</p>
          </div>
        </div>
      </div>
    </div>
  );
}
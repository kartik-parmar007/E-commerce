import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useParams, useNavigate, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState("");
  const [purchaseMessage, setPurchaseMessage] = useState("");

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const response = await fetch(`${API_URL}/api/buyer/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (data.success) {
          setProduct(data.data);
        } else {
          setError(data.message || "Failed to load product");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, getToken]);

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!isSignedIn) {
      navigate("/buyer/sign-in");
      return;
    }

    try {
      // In a real app, this would connect to a cart API
      // For now, we'll use localStorage to simulate cart functionality
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingItem = cart.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          quantity: quantity,
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));

      setCartMessage("Product added to cart!");
      setTimeout(() => setCartMessage(""), 3000);
    } catch (err) {
      console.error("Error adding to cart:", err);
      setCartMessage("Failed to add product to cart");
    }
  };

  // Handle buy now
  const handleBuyNow = async () => {
    if (!isSignedIn) {
      navigate("/buyer/sign-in");
      return;
    }

    try {
      // In a real app, this would connect to a payment API
      setPurchaseMessage("Redirecting to checkout...");

      // Simulate checkout process
      setTimeout(() => {
        setPurchaseMessage("Purchase successful! Redirecting to orders...");
        setTimeout(() => {
          navigate("/buyer/dashboard");
        }, 2000);
      }, 1500);
    } catch (err) {
      console.error("Error processing purchase:", err);
      setPurchaseMessage("Failed to process purchase");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2>Error</h2>
          <p>{error}</p>
          <Link
            to="/buyer/dashboard"
            style={{ color: "#10B981", textDecoration: "none" }}
          >
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2>Product Not Found</h2>
          <p>
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/buyer/dashboard"
            style={{ color: "#10B981", textDecoration: "none" }}
          >
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

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
            🛒 Product Details
          </h1>
          <nav style={{ display: "flex", gap: "1rem" }}>
            <Link
              to="/buyer/dashboard"
              style={{
                padding: "0.5rem 1rem",
                color: "#666",
                textDecoration: "none",
                borderRadius: "6px",
                fontWeight: "500",
              }}
            >
              ← Back to Products
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
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ color: "#666", fontSize: "0.9rem" }}>
            {user?.primaryEmailAddress?.emailAddress}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div
        style={{
          padding: "6rem 2rem 2rem 2rem",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2rem",
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "2rem",
            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
          }}
        >
          {/* Product Image Section */}
          <div>
            {product.image_url ? (
              product.image_url.match(/\.(mp4|mov|webm|mpeg)$/i) ? (
                <video
                  src={`${API_URL}${product.image_url}`}
                  controls
                  style={{
                    width: "100%",
                    height: "400px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    backgroundColor: "#000",
                  }}
                />
              ) : (
                <img
                  src={`${API_URL}${product.image_url}`}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "400px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              )
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "400px",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#9ca3af",
                  fontSize: "4rem",
                }}
              >
                📦
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div>
            <h1
              style={{ fontSize: "2rem", color: "#333", margin: "0 0 1rem 0" }}
            >
              {product.name}
            </h1>

            <p
              style={{
                color: "#666",
                fontSize: "1rem",
                lineHeight: "1.6",
                marginBottom: "1.5rem",
              }}
            >
              {product.description ||
                "No description available for this product."}
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
                padding: "1rem",
                backgroundColor: "#f9fafb",
                borderRadius: "6px",
              }}
            >
              <div>
                <p
                  style={{
                    margin: "0 0 0.5rem 0",
                    fontSize: "0.9rem",
                    color: "#666",
                  }}
                >
                  Price
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "1.75rem",
                    fontWeight: "bold",
                    color: "#10B981",
                  }}
                >
                  ${parseFloat(product.price).toFixed(2)}
                </p>
              </div>

              <div>
                <p
                  style={{
                    margin: "0 0 0.5rem 0",
                    fontSize: "0.9rem",
                    color: "#666",
                  }}
                >
                  Availability
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "1rem",
                    fontWeight: "500",
                    color: product.stock > 0 ? "#10B981" : "#EF4444",
                  }}
                >
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of stock"}
                </p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Quantity
              </label>
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#e5e7eb",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "1.25rem",
                    cursor: quantity > 1 ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  -
                </button>
                <span
                  style={{
                    minWidth: "40px",
                    textAlign: "center",
                    fontSize: "1.125rem",
                    fontWeight: "500",
                  }}
                >
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock || 10, quantity + 1))
                  }
                  disabled={product.stock > 0 && quantity >= product.stock}
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#e5e7eb",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "1.25rem",
                    cursor:
                      product.stock > 0 && quantity < product.stock
                        ? "pointer"
                        : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                style={{
                  flex: 1,
                  padding: "1rem",
                  backgroundColor: product.stock > 0 ? "#3B82F6" : "#9ca3af",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: product.stock > 0 ? "pointer" : "not-allowed",
                  fontWeight: "500",
                  fontSize: "1rem",
                }}
              >
                🛒 Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                style={{
                  flex: 1,
                  padding: "1rem",
                  backgroundColor: product.stock > 0 ? "#10B981" : "#9ca3af",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: product.stock > 0 ? "pointer" : "not-allowed",
                  fontWeight: "500",
                  fontSize: "1rem",
                }}
              >
                💳 Buy Now
              </button>
            </div>

            {/* Messages */}
            {cartMessage && (
              <p
                style={{
                  textAlign: "center",
                  color: cartMessage.includes("Failed") ? "#EF4444" : "#10B981",
                  marginBottom: "1rem",
                }}
              >
                {cartMessage}
              </p>
            )}
            {purchaseMessage && (
              <p
                style={{
                  textAlign: "center",
                  color: purchaseMessage.includes("Failed")
                    ? "#EF4444"
                    : "#10B981",
                  marginBottom: "1rem",
                }}
              >
                {purchaseMessage}
              </p>
            )}

            {/* Seller Information */}
            <div
              style={{
                marginTop: "2rem",
                padding: "1rem",
                backgroundColor: "#f9fafb",
                borderRadius: "6px",
              }}
            >
              <h3
                style={{
                  margin: "0 0 1rem 0",
                  fontSize: "1.125rem",
                  color: "#333",
                }}
              >
                Seller Information
              </h3>
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    backgroundColor: "#e5e7eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                  }}
                >
                  🏪
                </div>
                <div>
                  <p style={{ margin: "0 0 0.25rem 0", fontWeight: "500" }}>
                    {product.seller_name && product.seller_name.trim()
                      ? `Seller: ${product.seller_name}`
                      : product.seller_email
                      ? `Seller: ${product.seller_email}`
                      : product.seller_id
                      ? `Seller ID: ${product.seller_id.substring(0, 10)}...`
                      : "Unknown Seller"}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.875rem", color: "#666" }}>
                    Verified Seller
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

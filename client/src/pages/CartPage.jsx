import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function CartPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load cart from localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(cart);
    setLoading(false);
  }, []);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }

    const updatedCart = cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    // In a real app, this would connect to a payment API
    alert("Checkout functionality would be implemented here!");
    // Clear cart after checkout
    setCartItems([]);
    localStorage.setItem("cart", JSON.stringify([]));
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>Loading cart...</p>
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
            🛒 Your Cart
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
              ← Continue Shopping
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
      <div style={{ padding: "6rem 2rem 2rem 2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{ marginBottom: "1.5rem" }}>Shopping Cart ({cartItems.length} items)</h2>

        {cartItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", backgroundColor: "white", borderRadius: "8px" }}>
            <h3>Your cart is empty</h3>
            <p style={{ color: "#666", marginBottom: "1.5rem" }}>Add some products to your cart!</p>
            <Link
              to="/buyer/dashboard"
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#10B981",
                color: "white",
                textDecoration: "none",
                borderRadius: "6px",
                fontWeight: "500",
              }}
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
            {/* Cart Items */}
            <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "1.5rem" }}>
              {cartItems.map((item) => (
                <div 
                  key={item.id}
                  style={{ 
                    display: "flex", 
                    gap: "1.5rem", 
                    padding: "1rem 0",
                    borderBottom: "1px solid #e5e7eb"
                  }}
                >
                  {item.image_url ? (
                    <img
                      src={`${API_URL}${item.image_url}`}
                      alt={item.name}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100px",
                        height: "100px",
                        backgroundColor: "#f3f4f6",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.5rem",
                      }}
                    >
                      📦
                    </div>
                  )}

                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: "0 0 0.5rem 0" }}>{item.name}</h3>
                    <p style={{ color: "#10B981", fontWeight: "bold", margin: "0 0 1rem 0" }}>
                      ${parseFloat(item.price).toFixed(2)}
                    </p>

                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={{
                            width: "30px",
                            height: "30px",
                            backgroundColor: "#e5e7eb",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "1rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{
                            width: "30px",
                            height: "30px",
                            backgroundColor: "#e5e7eb",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "1rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          color: "#EF4444",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontWeight: "500",
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div style={{ fontWeight: "bold" }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "1.5rem", height: "fit-content" }}>
              <h3 style={{ margin: "0 0 1.5rem 0" }}>Order Summary</h3>
              
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span>Subtotal</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  marginTop: "1rem", 
                  paddingTop: "1rem", 
                  borderTop: "2px solid #e5e7eb",
                  fontWeight: "bold",
                  fontSize: "1.125rem"
                }}>
                  <span>Total</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                style={{
                  width: "100%",
                  padding: "1rem",
                  backgroundColor: "#10B981",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "500",
                  fontSize: "1rem",
                  marginTop: "1rem",
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { formatINR } from "../utils/formatCurrency";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function CartPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(cart);
    setLoading(false);
  }, []);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) return removeFromCart(id);

    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleCheckout = () => {
    alert("Checkout functionality will be implemented here!");
    setCartItems([]);
    localStorage.setItem("cart", JSON.stringify([]));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p className="animate-pulse">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white">
      {/* NAVBAR */}
      <header
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4
        backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-lg flex justify-between items-center"
      >
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-bold text-purple-300 drop-shadow-md">
            🛒 Your Cart
          </h1>

          <Link
            to="/buyer/dashboard"
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            ← Continue Shopping
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm opacity-80">
            {user?.primaryEmailAddress?.emailAddress}
          </span>
        </div>
      </header>

      {/* MAIN BODY */}
      <div className="pt-28 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 drop-shadow-md">
          Shopping Cart ({cartItems.length} items)
        </h2>

        {cartItems.length === 0 ? (
          <div className="text-center p-10 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg animate-fadeInSlow">
            <h3 className="text-2xl font-semibold mb-2">Your cart is empty</h3>
            <p className="opacity-80 mb-4">Add some products to your cart!</p>

            <Link
              to="/buyer/dashboard"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold shadow-lg hover:scale-105 transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* CART ITEMS */}
            <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg animate-fadeInSlow">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 py-5 border-b border-white/20"
                >
                  {/* IMAGE */}
                  {item.image_url ? (
                    <img
                      src={`${API_URL}${item.image_url}`}
                      alt={item.name}
                      className="w-28 h-28 object-cover rounded-xl"
                    />
                  ) : (
                    <div className="w-28 h-28 bg-white/10 rounded-xl flex items-center justify-center text-4xl">
                      📦
                    </div>
                  )}

                  {/* DETAILS */}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{item.name}</h3>
                    <p className="text-purple-300 font-bold">
                      {formatINR(item.price)}
                    </p>

                    {/* QUANTITY */}
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-md shadow flex justify-center items-center"
                        >
                          -
                        </button>

                        <span className="text-lg">{item.quantity}</span>

                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-md shadow flex justify-center items-center"
                        >
                          +
                        </button>
                      </div>

                      {/* REMOVE */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-300 font-semibold transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* TOTAL */}
                  <div className="font-bold text-lg text-purple-300">
                    {formatINR(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* ORDER SUMMARY */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl animate-slideUp h-fit">
              <h3 className="text-2xl font-bold mb-4">Order Summary</h3>

              <div className="space-y-2 text-lg">
                <div className="flex justify-between opacity-80">
                  <span>Subtotal</span>
                  <span>{formatINR(getTotalPrice())}</span>
                </div>

                <div className="flex justify-between opacity-80">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>

                <div className="flex justify-between opacity-80">
                  <span>Tax</span>
                  <span>{formatINR(0)}</span>
                </div>

                <div className="flex justify-between font-bold text-purple-300 pt-3 mt-3 border-t border-white/20 text-xl">
                  <span>Total</span>
                  <span>{formatINR(getTotalPrice())}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="
                  w-full mt-6 py-3 bg-purple-600 hover:bg-purple-700 
                  rounded-lg font-semibold text-white shadow-lg 
                  hover:scale-105 transition
                "
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ANIMATIONS */}
      <style>
        {`
          @keyframes fadeInSlow {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeInSlow {
            animation: fadeInSlow 1.2s ease-out forwards;
          }
          @keyframes slideUp {
            0% { opacity: 0; transform: translateY(50px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-slideUp {
            animation: slideUp 1s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}

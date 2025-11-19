import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { formatINR } from "../utils/formatCurrency";
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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/buyer/products/${id}`);
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

    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!isSignedIn) return navigate("/buyer/sign-in");

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        quantity,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    setCartMessage("Product added to cart!");
    setTimeout(() => setCartMessage(""), 2500);
  };

  const handleBuyNow = () => {
    if (!isSignedIn) return navigate("/buyer/sign-in");

    setPurchaseMessage("Redirecting to checkout...");

    setTimeout(() => {
      setPurchaseMessage("Purchase successful! Redirecting...");
      setTimeout(() => navigate("/buyer/dashboard"), 2000);
    }, 1500);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p className="animate-pulse">Loading product...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center bg-white/10 backdrop-blur-xl p-10 rounded-2xl border border-white/20 shadow-xl">
          <h2 className="text-3xl font-bold">Error</h2>
          <p className="opacity-80">{error}</p>
          <Link
            className="text-purple-300 mt-4 block hover:underline"
            to="/buyer/dashboard"
          >
            ← Back to Products
          </Link>
        </div>
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center bg-white/10 backdrop-blur-xl p-10 rounded-2xl border border-white/20 shadow-xl">
          <h2 className="text-3xl font-bold">Product Not Found</h2>
          <p className="opacity-80">This product may have been removed.</p>
          <Link
            className="text-purple-300 mt-4 block hover:underline"
            to="/buyer/dashboard"
          >
            ← Back to Products
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white">
      {/* NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-bold text-purple-300 drop-shadow-md">
            🛒 Product Details
          </h1>

          <nav className="flex gap-4">
            <Link
              to="/buyer/dashboard"
              className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
            >
              ← Back
            </Link>

            <Link
              to="/cart"
              className="px-4 py-2 bg-purple-600/40 rounded-lg hover:bg-purple-600/60 transition"
            >
              🛒 Cart
            </Link>
          </nav>
        </div>

        <div className="opacity-80 text-sm">
          {user?.primaryEmailAddress?.emailAddress}
        </div>
      </header>

      {/* PRODUCT CONTENT */}
      <div className="pt-28 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl p-8 animate-fadeInSlow">
          {/* PRODUCT IMAGE */}
          <div>
            {product.image_url ? (
              product.image_url.match(/\.(mp4|mov|webm|mpeg)$/i) ? (
                <video
                  src={`${API_URL}${product.image_url}`}
                  controls
                  className="w-full h-[420px] object-cover rounded-xl shadow-lg"
                />
              ) : (
                <img
                  src={`${API_URL}${product.image_url}`}
                  className="w-full h-[420px] object-cover rounded-xl shadow-lg"
                  alt={product.name}
                />
              )
            ) : (
              <div className="w-full h-[420px] bg-white/10 rounded-xl flex items-center justify-center text-6xl">
                📦
              </div>
            )}
          </div>

          {/* DETAILS */}
          <div>
            <h1 className="text-4xl font-bold mb-4 drop-shadow">
              {product.name}
            </h1>

            <p className="opacity-90 text-lg leading-relaxed mb-6">
              {product.description || "No description available."}
            </p>

            {/* PRICE + STOCK */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/20 shadow-lg flex justify-between">
              <div>
                <p className="text-sm opacity-70">Price</p>
                <p className="text-3xl font-bold text-purple-300 drop-shadow">
                  {formatINR(product.price)}
                </p>
              </div>

              <div>
                <p className="text-sm opacity-70">Availability</p>
                <p
                  className={`font-bold ${
                    product.stock > 0 ? "text-green-300" : "text-red-300"
                  }`}
                >
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of Stock"}
                </p>
              </div>
            </div>

            {/* QUANTITY */}
            <div className="mt-6">
              <p className="font-semibold mb-2 opacity-90">Quantity</p>

              <div className="flex items-center gap-4">
                <button
                  className="w-10 h-10 bg-white/20 rounded-lg hover:bg-white/30 transition"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>

                <span className="text-xl font-bold">{quantity}</span>

                <button
                  className="w-10 h-10 bg-white/20 rounded-lg hover:bg-white/30 transition"
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <button
                className={`
                  py-3 rounded-lg font-semibold shadow-lg transition
                  ${
                    product.stock > 0
                      ? "bg-purple-600 hover:bg-purple-700 hover:scale-105"
                      : "bg-gray-600 cursor-not-allowed"
                  }
                `}
                onClick={handleAddToCart}
              >
                🛒 Add to Cart
              </button>

              <button
                className={`
                  py-3 rounded-lg font-semibold shadow-lg transition
                  ${
                    product.stock > 0
                      ? "bg-green-600 hover:bg-green-700 hover:scale-105"
                      : "bg-gray-600 cursor-not-allowed"
                  }
                `}
                onClick={handleBuyNow}
              >
                💳 Buy Now
              </button>
            </div>

            {/* MESSAGES */}
            {cartMessage && (
              <p className="text-green-300 text-center mt-4">{cartMessage}</p>
            )}

            {purchaseMessage && (
              <p className="text-purple-300 text-center mt-4">
                {purchaseMessage}
              </p>
            )}

            {/* SELLER INFO */}
            <div className="bg-white/10 border border-white/20 rounded-xl p-4 mt-10 backdrop-blur-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-3">Seller Information</h3>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                  🏪
                </div>

                <div>
                  <p className="font-semibold">
                    {product.seller_name ||
                      product.seller_email ||
                      `Seller ID: ${product.seller_id?.slice(0, 10)}...`}
                  </p>
                  <p className="text-sm opacity-80">Verified Seller</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ANIMATIONS */}
      <style>
        {`
          @keyframes fadeInSlow {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeInSlow {
            animation: fadeInSlow 1s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}

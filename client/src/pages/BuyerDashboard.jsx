import { useState, useEffect } from "react";
import { formatINR } from "../utils/formatCurrency";
import { useAuth, useUser, UserButton, SignedIn } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterUser } from "../hooks/useRegisterUser";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function BuyerDashboard() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  const { isRegistered, error: registrationError } = useRegisterUser("buyer");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/buyer/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setProducts(data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white">
      {/* NAVBAR */}
      <header
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4
        backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-lg flex justify-between items-center"
      >
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-bold text-purple-300 drop-shadow-md">
            🛒 Buyer Dashboard
          </h1>

          <nav className="flex gap-3">
            <Link
              to="/"
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
            >
              Home
            </Link>
            <Link
              to="/cart"
              className="px-4 py-2 rounded-lg bg-purple-500/30 hover:bg-purple-500/50 transition"
            >
              🛒 Cart
            </Link>
          </nav>
        </div>

        <SignedIn>
          <div className="flex items-center gap-3">
            <span className="text-sm opacity-80">
              {user?.primaryEmailAddress?.emailAddress}
            </span>
            <UserButton />
          </div>
        </SignedIn>
      </header>

      {/* BODY CONTAINER */}
      <div className="pt-28 px-6 max-w-6xl mx-auto">
        {/* PAGE HEADING */}
        <div className="text-center mb-8 animate-fadeInSlow">
          <h2 className="text-4xl font-bold drop-shadow-md">Browse Products</h2>
          <p className="opacity-80">Find the best deals today</p>
        </div>

        {/* SEARCH BAR */}
        <div className="mb-10 animate-slideUp">
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="
              w-full p-4 rounded-xl bg-white/20 text-white border border-white/20
              focus:ring-2 focus:ring-purple-400 placeholder-white/60 shadow-lg
            "
          />
        </div>

        {/* PRODUCT COUNT */}
        <h2 className="text-xl font-semibold mb-4">
          Available Products ({filteredProducts.length})
        </h2>

        {/* PRODUCTS GRID */}
        {loading ? (
          <p className="text-center py-10 animate-pulse">Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center opacity-70 py-10">
            {searchTerm ? "No products found" : "No products available"}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="
                  bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20 
                  shadow-lg transition hover:shadow-purple-400/40 hover:scale-[1.03]
                  cursor-pointer animate-fadeInSlow
                "
              >
                {/* MEDIA */}
                {product.image_url ? (
                  product.image_url.match(/\.(mp4|mov|webm)$/i) ? (
                    <video
                      src={`${API_URL}${product.image_url}`}
                      controls
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="w-full h-48 object-cover rounded-xl mb-3"
                    />
                  ) : (
                    <img
                      src={`${API_URL}${product.image_url}`}
                      alt={product.name}
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="w-full h-48 object-cover rounded-xl mb-3"
                    />
                  )
                ) : (
                  <div
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="w-full h-48 bg-white/10 rounded-xl flex items-center justify-center text-5xl"
                  >
                    📦
                  </div>
                )}

                {/* TITLE */}
                <h3
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="text-xl font-semibold hover:text-purple-300 transition"
                >
                  {product.name}
                </h3>

                {/* DESCRIPTION */}
                <p
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="text-sm opacity-80 min-h-[40px]"
                >
                  {product.description || "No description available"}
                </p>

                {/* PRICE */}
                <p className="text-purple-300 text-xl font-bold mt-2">
                  {formatINR(product.price)}
                </p>

                {/* STOCK */}
                <p
                  className={`text-sm font-semibold mt-1 
                  ${product.stock > 0 ? "text-green-300" : "text-red-300"}`}
                >
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of stock"}
                </p>

                {/* BUTTON */}
                <button
                  onClick={() => navigate(`/product/${product.id}`)}
                  disabled={product.stock === 0}
                  className={`
                    w-full mt-4 py-2 rounded-lg font-semibold shadow-md transition
                    ${
                      product.stock > 0
                        ? "bg-purple-600 hover:bg-purple-700 hover:scale-105"
                        : "bg-gray-600 cursor-not-allowed"
                    }
                  `}
                >
                  {product.stock > 0 ? "🛒 View Details" : "Out of Stock"}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* STATISTICS SECTION */}
        <div
          className="
          mt-14 p-6 bg-white/10 backdrop-blur-xl border border-white/20 
          rounded-2xl shadow-lg grid grid-cols-1 sm:grid-cols-3 gap-6 animate-slideUp
        "
        >
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-300">
              {products.length}
            </p>
            <p className="opacity-80">Total Products</p>
          </div>

          <div className="text-center">
            <p className="text-3xl font-bold text-purple-300">
              {products.filter((p) => p.stock > 0).length}
            </p>
            <p className="opacity-80">In Stock</p>
          </div>

          <div className="text-center">
            <p className="text-3xl font-bold text-purple-300">
              {products.length > 0
                ? formatINR(
                    products.reduce((sum, p) => sum + parseFloat(p.price), 0) /
                      products.length
                  )
                : formatINR(0)}
            </p>
            <p className="opacity-80">Average Price</p>
          </div>
        </div>
      </div>

      {/* ANIMATIONS */}
      <style>
        {`
          @keyframes fadeInSlow {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeInSlow {
            animation: fadeInSlow 1s ease-out forwards;
          }

          @keyframes slideUp {
            0% { opacity: 0; transform: translateY(40px); }
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

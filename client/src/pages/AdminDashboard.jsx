  import { useState, useEffect } from "react";
import { formatINR } from "../utils/formatCurrency";
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
    image_url: "",
  });
  const [message, setMessage] = useState("");

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/admin/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setProducts(data.data);
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
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const token = await getToken();
      const response = await fetch(
        `${API_URL}/api/admin/products/${productId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (data.success) {
        setMessage("Product deleted successfully");
        fetchProducts();
      } else setMessage(data.message || "Failed to delete product");
    } catch (error) {
      console.error("Error deleting product:", error);
      setMessage("Failed to delete product");
    }
  };

  // Edit Product
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsEditing(true);
    setEditForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      stock: product.stock || 0,
      image_url: product.image_url || "",
    });
  };

  // Update Product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    try {
      const token = await getToken();
      const response = await fetch(
        `${API_URL}/api/admin/products/${selectedProduct.id}`,
        {
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
            image_url: editForm.image_url,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setMessage("Product updated successfully");
        setIsEditing(false);
        setSelectedProduct(null);
        fetchProducts();
      } else setMessage(data.message || "Failed to update product");
    } catch (error) {
      console.error("Error updating product:", error);
      setMessage("Failed to update product");
    }
  };

  // Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Cancel Edit
  const cancelEditing = () => {
    setIsEditing(false);
    setSelectedProduct(null);
    setEditForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      image_url: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white">
      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 
        backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-lg flex justify-between items-center"
      >
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-bold text-purple-300 drop-shadow-md">
            🔐 Admin Dashboard
          </h1>

          <nav className="flex gap-3">
            <Link
              to="/"
              className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
            >
              Home
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

      {/* Main Body */}
      <div className="pt-28 px-6 max-w-6xl mx-auto">
        {/* Page Title */}
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold drop-shadow-md animate-fadeInSlow">
            Manage Products
          </h2>
          <p className="opacity-70">Admin Control Panel</p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`
            p-3 mb-4 rounded-xl text-center animate-fadeInSlow 
            ${
              message.includes("Failed")
                ? "bg-red-300/20 text-red-200 border border-red-400/40"
                : "bg-green-300/20 text-green-200 border border-green-400/40"
            }
          `}
          >
            {message}
          </div>
        )}

        {/* Edit Form */}
        {isEditing && selectedProduct && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl p-6 rounded-2xl mb-10 animate-slideUp">
            <h3 className="text-xl font-semibold mb-4 text-purple-200">
              Edit Product
            </h3>

            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div>
                <label className="font-medium text-purple-100">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-purple-100">
                  Description
                </label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 min-h-[120px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-purple-100">
                    Price (INR)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={editForm.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30"
                    required
                  />
                </div>

                <div>
                  <label className="font-medium text-purple-100">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={editForm.stock}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-purple-100">Image URL</label>
                <input
                  type="text"
                  name="image_url"
                  value={editForm.image_url}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 mt-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white shadow-lg hover:scale-105 transition"
                >
                  Update Product
                </button>

                <button
                  type="button"
                  onClick={cancelEditing}
                  className="px-6 py-2 bg-gray-400/30 hover:bg-gray-500/40 rounded-lg text-white shadow-lg hover:scale-105 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Product List */}
        <h2 className="text-2xl font-semibold mb-4">
          All Products ({products.length})
        </h2>

        {loading ? (
          <p className="text-center py-10 animate-pulse">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-center opacity-70 py-10">No products available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-lg 
                transition-all duration-300 hover:scale-[1.03] hover:shadow-purple-400/40 animate-fadeInSlow"
              >
                {/* Product Media */}
                {product.image_url ? (
                  product.image_url.match(/\.(mp4|mov|webm|mpeg)$/i) ? (
                    <video
                      src={`${API_URL}${product.image_url}`}
                      controls
                      className="w-full h-48 rounded-lg object-cover mb-3"
                    />
                  ) : (
                    <img
                      src={`${API_URL}${product.image_url}`}
                      alt={product.name}
                      className="w-full h-48 rounded-lg object-cover mb-3"
                    />
                  )
                ) : (
                  <div className="w-full h-48 bg-white/10 rounded-xl flex items-center justify-center text-4xl">
                    📦
                  </div>
                )}

                {/* Product Info */}
                <h3 className="text-xl font-semibold">{product.name}</h3>

                <p className="text-sm opacity-80 min-h-[40px]">
                  {product.description || "No description available"}
                </p>

                <p className="text-purple-300 text-xl font-bold mt-2">
                  {formatINR(product.price)}
                </p>

                <p
                  className={`text-sm font-semibold mt-1 
                  ${product.stock > 0 ? "text-green-300" : "text-red-300"}`}
                >
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of stock"}
                </p>

                <p className="text-xs opacity-70 mt-1">
                  Seller:{" "}
                  {product.seller_name ||
                    product.seller_email ||
                    product.seller_id}
                </p>

                {/* Buttons */}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="flex-1 px-3 py-2 bg-yellow-500/80 hover:bg-yellow-600 rounded-lg text-white font-medium shadow-md hover:scale-105 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="flex-1 px-3 py-2 bg-red-500/80 hover:bg-red-600 rounded-lg text-white font-medium shadow-md hover:scale-105 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Animations */}
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

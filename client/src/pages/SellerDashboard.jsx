import { useState, useEffect } from "react";
import { formatINR } from "../utils/formatCurrency";
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

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("stock", formData.stock || 0);

      if (mediaFile) {
        formDataToSend.append("media", mediaFile);
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
    setMediaPreview(
      product.image_url ? `${API_URL}${product.image_url}` : null
    );
    setShowAddForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white">
      {/* NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-bold text-purple-300 drop-shadow-md">
            🏪 Seller Portal
          </h1>
          <nav className="flex gap-3">
            <Link
              to="/"
              className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
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

      {/* MAIN CONTENT */}
      <div className="pt-28 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold drop-shadow-md">
            Seller Dashboard
          </h2>
          <p className="opacity-80">Welcome, {user?.firstName || "Seller"}!</p>
        </div>

        {/* TABS */}
        <div className="flex gap-4 mb-6 border-b border-white/20">
          <button
            onClick={() => setActiveTab("my-products")}
            className={`pb-3 px-4 text-sm font-semibold transition border-b-2 ${
              activeTab === "my-products"
                ? "border-purple-400 text-purple-200"
                : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            My Products
          </button>
          <button
            onClick={() => setActiveTab("all-products")}
            className={`pb-3 px-4 text-sm font-semibold transition border-b-2 ${
              activeTab === "all-products"
                ? "border-purple-400 text-purple-200"
                : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            All Products
          </button>
        </div>

        {/* MY PRODUCTS TAB */}
        {activeTab === "my-products" && (
          <div className="space-y-6">
            {/* Header & Add Button */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                My Products ({myProducts.length})
              </h2>
              <button
                onClick={() => {
                  setShowAddForm(!showAddForm);
                  setEditingProduct(null);
                  setFormData({
                    name: "",
                    description: "",
                    price: "",
                    stock: "",
                  });
                  setMediaFile(null);
                  setMediaPreview(null);
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold shadow-md transition"
              >
                {showAddForm ? "Cancel" : "+ Add New Product"}
              </button>
            </div>

            {/* Add/Edit Form */}
            {showAddForm && (
              <form
                onSubmit={handleSubmit}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg space-y-4 animate-fadeInSlow"
              >
                <h3 className="text-lg font-semibold mb-2">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>

                <input
                  type="text"
                  placeholder="Product Name *"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/60"
                />

                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="3"
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/60"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Price *"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/60"
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/60"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block mb-2 font-medium">
                    Product Image / Video
                  </label>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="w-full p-3 rounded-lg bg-white/5 border-2 border-dashed border-white/30 cursor-pointer"
                  />
                  <p className="text-xs opacity-70 mt-1">
                    Accepted: Images (JPEG, PNG, GIF, WebP) and Videos (MP4,
                    MOV, WebM) - Max 10MB
                  </p>
                </div>

                {/* Preview */}
                {mediaPreview && (
                  <div>
                    <p className="mb-2 font-medium">Preview</p>
                    {mediaFile && mediaFile.type.startsWith("video/") ? (
                      <video
                        src={mediaPreview}
                        controls
                        className="w-full max-h-72 rounded-xl bg-black object-contain"
                      />
                    ) : (
                      <img
                        src={mediaPreview}
                        alt="Preview"
                        className="w-full max-h-72 rounded-xl object-contain"
                      />
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full mt-2 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold shadow-md transition"
                >
                  {editingProduct ? "Update Product" : "Create Product"}
                </button>
              </form>
            )}

            {/* My Products Grid */}
            {loading ? (
              <p className="text-center opacity-80">Loading...</p>
            ) : myProducts.length === 0 ? (
              <p className="text-center opacity-70 py-10">
                No products yet. Create your first product!
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-lg transition hover:shadow-purple-400/40 hover:scale-[1.02]"
                  >
                    {product.image_url &&
                      (product.image_url.match(/\.(mp4|mov|webm|mpeg)$/i) ? (
                        <video
                          src={`${API_URL}${product.image_url}`}
                          controls
                          className="w-full h-44 rounded-xl object-cover mb-3 bg-black"
                        />
                      ) : (
                        <img
                          src={`${API_URL}${product.image_url}`}
                          alt={product.name}
                          className="w-full h-44 rounded-xl object-cover mb-3"
                        />
                      ))}

                    <h3 className="text-lg font-semibold mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm opacity-80 mb-2">
                      {product.description}
                    </p>
                    <p className="text-purple-300 text-xl font-bold mb-1">
                      {formatINR(product.price)}
                    </p>
                    <p className="text-sm opacity-80">Stock: {product.stock}</p>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-semibold shadow-md transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="flex-1 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm font-semibold shadow-md transition"
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

        {/* ALL PRODUCTS TAB */}
        {activeTab === "all-products" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              All Products in Marketplace ({allProducts.length})
            </h2>

            {loading ? (
              <p className="text-center opacity-80">Loading...</p>
            ) : allProducts.length === 0 ? (
              <p className="text-center opacity-70 py-10">
                No products available
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
                {allProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-lg transition hover:shadow-purple-400/40 hover:scale-[1.02]"
                  >
                    {product.image_url &&
                      (product.image_url.match(/\.(mp4|mov|webm|mpeg)$/i) ? (
                        <video
                          src={`${API_URL}${product.image_url}`}
                          controls
                          className="w-full h-44 rounded-xl object-cover mb-3 bg-black"
                        />
                      ) : (
                        <img
                          src={`${API_URL}${product.image_url}`}
                          alt={product.name}
                          className="w-full h-44 rounded-xl object-cover mb-3"
                        />
                      ))}

                    <h3 className="text-lg font-semibold mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm opacity-80 mb-2">
                      {product.description}
                    </p>
                    <p className="text-purple-300 text-xl font-bold mb-1">
                      {formatINR(product.price)}
                    </p>
                    <p className="text-sm opacity-80">Stock: {product.stock}</p>
                    <p className="text-xs opacity-60 mt-1">
                      Seller ID: {product.seller_id.substring(0, 10)}...
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Simple animation keyframes */}
      <style>
        {`
          @keyframes fadeInSlow {
            0% { opacity: 0; transform: translateY(15px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeInSlow {
            animation: fadeInSlow 0.9s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}

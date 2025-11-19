import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home.jsx";
import SellerSignInPage from "./components/seller-sign-in.jsx";
import SellerSignUpPage from "./components/seller-sign-up.jsx";
import BuyerSignInPage from "./components/buyer-sign-in.jsx";
import BuyerSignUpPage from "./components/buyer-sign-up.jsx";
import SellerDashboard from "./pages/SellerDashboard.jsx";
import BuyerDashboard from "./pages/BuyerDashboard.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<App />} />
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/seller/sign-in/*" element={<SellerSignInPage />} />
          <Route path="/seller/sign-up/*" element={<SellerSignUpPage />} />
          <Route path="/buyer/sign-in/*" element={<BuyerSignInPage />} />
          <Route path="/buyer/sign-up/*" element={<BuyerSignUpPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
);
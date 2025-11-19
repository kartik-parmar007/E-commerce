import { SignIn } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { useRegisterUser } from "../hooks/useRegisterUser";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SellerSignInPage() {
  const { isRegistered, error, loading } = useRegisterUser("seller");
  const { user } = useUser();
  const navigate = useNavigate();

  // Check if the signed-in user is admin and redirect accordingly
  useEffect(() => {
    if (user && user.primaryEmailAddress?.emailAddress === "kartikparmar9773@gmail.com") {
      navigate("/admin/dashboard");
    }
  }, [user, navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#F3F4F6",
        flexDirection: "column",
      }}
    >
      <div style={{ marginBottom: "1rem", textAlign: "center" }}>
        <h2 style={{ color: "#4F46E5", fontSize: "1.5rem", marginBottom: "0.5rem" }}>
          🏪 Seller Sign In
        </h2>
        <p style={{ color: "#666" }}>Sign in to manage your products and sales</p>
        {loading && <p style={{ color: "#4F46E5", fontSize: "0.9rem" }}>Setting up your seller account...</p>}
        {error && <p style={{ color: "#ef4444", fontSize: "0.9rem" }}>Error: {error}</p>}
      </div>
      <SignIn
        routing="path"
        path="/seller/sign-in"
        signUpUrl="/seller/sign-up"
        redirectUrl="/seller/dashboard"
        appearance={{
          variables: {
            colorPrimary: "#4F46E5",
          },
        }}
      />
      <div style={{ marginTop: "1rem" }}>
        <Link
          to="/"
          style={{
            color: "#4F46E5",
            textDecoration: "none",
            fontSize: "0.9rem",
          }}
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
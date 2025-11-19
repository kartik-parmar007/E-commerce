import { SignIn } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { useRegisterUser } from "../hooks/useRegisterUser";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function BuyerSignInPage() {
  const { isRegistered, error, loading } = useRegisterUser("buyer");
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
        <h2 style={{ color: "#10B981", fontSize: "1.5rem", marginBottom: "0.5rem" }}>
          🛒 Buyer Sign In
        </h2>
        <p style={{ color: "#666" }}>Sign in to browse and purchase products</p>
        {loading && <p style={{ color: "#10B981", fontSize: "0.9rem" }}>Setting up your buyer account...</p>}
        {error && <p style={{ color: "#ef4444", fontSize: "0.9rem" }}>Error: {error}</p>}
      </div>
      <SignIn
        routing="path"
        path="/buyer/sign-in"
        signUpUrl="/buyer/sign-up"
        redirectUrl="/buyer/dashboard"
        appearance={{
          variables: {
            colorPrimary: "#10B981",
          },
        }}
      />
      <div style={{ marginTop: "1rem" }}>
        <Link
          to="/"
          style={{
            color: "#10B981",
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
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
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
        <h1 style={{ margin: 0, fontSize: "1.5rem", color: "#333" }}>
          E-Commerce
        </h1>
        <SignedOut>
          <nav style={{ display: "flex", gap: "1rem" }}>
            <Link
              to="/"
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#4F46E5",
                color: "white",
                textDecoration: "none",
                borderRadius: "6px",
                fontWeight: "500",
              }}
            >
              Home
            </Link>
          </nav>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <main
  style={{
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    paddingTop: "5rem",
    padding: "5rem 2rem 2rem 2rem",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#fff",
    fontFamily: "'Roboto', sans-serif",
    overflow: "auto",
  }}
>
  <SignedOut>
    <div
      style={{
        textAlign: "center",
        marginTop: "4rem",
        animation: "fadeIn 1.5s ease-in-out",
      }}
    >
      <h2
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          marginBottom: "1rem",
          animation: "slideInDown 1s ease-out",
        }}
      >
        Welcome to E-Commerce
      </h2>
      <p
        style={{
          fontSize: "1.2rem",
          opacity: 0.9,
          animation: "slideInUp 1s ease-out 0.5s forwards",
          transform: "translateY(20px)",
        }}
      >
        Please sign in or sign up to continue
      </p>
      <div style={{ marginTop: "2rem" }}>
        <button
          style={{
            padding: "0.8rem 2rem",
            fontSize: "1rem",
            fontWeight: "bold",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            background: "#ff6f61",
            color: "#fff",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          Sign In / Sign Up
        </button>
      </div>
    </div>
  </SignedOut>

  <SignedIn>
    <div
      style={{
        textAlign: "center",
        marginTop: "4rem",
        animation: "fadeIn 1.5s ease-in-out",
      }}
    >
      <h2
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          marginBottom: "1rem",
          color: "#ffeb3b",
          animation: "slideInDown 1s ease-out",
        }}
      >
        Welcome to Your E-Commerce Dashboard
      </h2>
      <p
        style={{
          fontSize: "1.2rem",
          opacity: 0.9,
          animation: "slideInUp 1s ease-out 0.5s forwards",
          transform: "translateY(20px)",
        }}
      >
        You are successfully signed in!
      </p>
    </div>
  </SignedIn>

  {/* CSS Animations */}
  <style>
    {`
      @keyframes fadeIn {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }
      @keyframes slideInDown {
        0% { opacity: 0; transform: translateY(-50px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes slideInUp {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
      }
    `}
  </style>
</main>

    </div>
  );
}

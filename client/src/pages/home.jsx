import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Header */}
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
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.5rem", color: "#333" }}>
          E-Commerce Platform
        </h1>
      </header>

      {/* Main Content */}
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "6rem 2rem 4rem 2rem",
          minHeight: "100vh",
        }}
      >
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#333" }}>
          Welcome to Our E-Commerce Platform
        </h2>
        <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: "3rem" }}>
          Choose your account type to get started
        </p>

        {/* Role Selection Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
            maxWidth: "1100px",
            width: "100%",
          }}
        >
          {/* Seller Card */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "2rem",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              textAlign: "center",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-5px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <div
              style={{
                fontSize: "3rem",
                marginBottom: "1rem",
              }}
            >
              🏪
            </div>
            <h3
              style={{
                fontSize: "1.5rem",
                marginBottom: "1rem",
                color: "#333",
              }}
            >
              Seller Account
            </h3>
            <p style={{ color: "#666", marginBottom: "1.5rem" }}>
              Sell your products and manage your inventory
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <Link
                to="/seller/sign-in"
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#4F46E5",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "8px",
                  fontWeight: "500",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#4338CA")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#4F46E5")
                }
              >
                Sign In
              </Link>
              <Link
                to="/seller/sign-up"
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "white",
                  color: "#4F46E5",
                  textDecoration: "none",
                  borderRadius: "8px",
                  fontWeight: "500",
                  border: "2px solid #4F46E5",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#4F46E5";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.color = "#4F46E5";
                }}
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Buyer Card */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "2rem",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              textAlign: "center",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-5px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <div
              style={{
                fontSize: "3rem",
                marginBottom: "1rem",
              }}
            >
              🛒
            </div>
            <h3
              style={{
                fontSize: "1.5rem",
                marginBottom: "1rem",
                color: "#333",
              }}
            >
              Buyer Account
            </h3>
            <p style={{ color: "#666", marginBottom: "1.5rem" }}>
              Browse and purchase products from our sellers
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <Link
                to="/buyer/sign-in"
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#10B981",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "8px",
                  fontWeight: "500",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#059669")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#10B981")
                }
              >
                Sign In
              </Link>
              <Link
                to="/buyer/sign-up"
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "white",
                  color: "#10B981",
                  textDecoration: "none",
                  borderRadius: "8px",
                  fontWeight: "500",
                  border: "2px solid #10B981",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#10B981";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.color = "#10B981";
                }}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
        
        {/* Admin Note */}
        <div style={{ 
          marginTop: "2rem", 
          padding: "1rem", 
          backgroundColor: "#EFF6FF", 
          borderRadius: "8px", 
          textAlign: "center",
          maxWidth: "600px"
        }}>
          <p style={{ color: "#1E40AF", margin: 0 }}>
            <strong>Administrator Access:</strong> Users with email <em>kartikparmar9773@gmail.com</em> will be automatically recognized as administrators upon login.
          </p>
        </div>
      </main>
    </div>
  );
}
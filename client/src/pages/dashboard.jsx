import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4c1d95] relative overflow-hidden">
      {/* Floating background circles */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-pink-500 opacity-30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-indigo-500 opacity-30 rounded-full blur-3xl animate-pulse delay-700"></div>

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-lg px-6 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-white tracking-wide drop-shadow-md">
          E-Commerce
        </h1>

        <SignedOut>
          <nav className="flex gap-4">
            <Link
              to="/"
              className="px-5 py-2 bg-pink-500 text-white font-medium rounded-lg
              shadow-md hover:bg-pink-600 hover:scale-105 active:scale-95 transition duration-300"
            >
              Home
            </Link>
          </nav>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </header>

      {/* MAIN SECTION */}
      <main className="flex flex-col justify-center items-center min-h-screen pt-24 px-6 text-white">
        {/* SIGNED OUT VIEW */}
        <SignedOut>
          <div className="text-center mt-16 animate-fadeInSlow">
            <h2 className="text-5xl font-extrabold mb-4 animate-slideDownGlow drop-shadow-lg">
              Welcome to E-Commerce
            </h2>

            <p className="text-xl opacity-90 animate-slideUp">
              Please sign in or sign up to continue
            </p>

            {/* Glassmorphism button */}
            <div className="mt-10">
              <button
                className="
                  px-8 py-3 
                  bg-white/20 backdrop-blur-xl 
                  border border-white/30 
                  text-white font-semibold 
                  rounded-xl shadow-lg 
                  transition-all duration-300
                  hover:scale-110 hover:shadow-pink-500/50
                  active:scale-95
                "
              >
                Sign In / Sign Up
              </button>
            </div>
          </div>
        </SignedOut>

        {/* SIGNED IN VIEW */}
        <SignedIn>
          <div className="text-center mt-16 animate-fadeInSlow">
            <h2 className="text-5xl font-extrabold mb-4 text-yellow-300 animate-slideDownGlow drop-shadow-lg">
              Welcome to Your Dashboard
            </h2>

            <p className="text-xl opacity-90 animate-slideUp">
              You are successfully signed in!
            </p>

            {/* Animated Glass Card */}
            <div
              className="
              mt-10 p-6 
              w-full max-w-md 
              bg-white/10 backdrop-blur-xl 
              border border-white/20 rounded-2xl 
              shadow-xl animate-float 
            "
            >
              <h3 className="text-2xl font-semibold mb-3">✨ Your Account</h3>
              <p className="opacity-80">
                Explore products, manage your cart, review orders and much more.
              </p>
            </div>
          </div>
        </SignedIn>
      </main>

      {/* CUSTOM ANIMATIONS */}
      <style>
        {`
          @keyframes fadeInSlow {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeInSlow {
            animation: fadeInSlow 1.5s ease-out forwards;
          }

          @keyframes slideDownGlow {
            0% { opacity: 0; transform: translateY(-40px); text-shadow: none; }
            100% { opacity: 1; transform: translateY(0); text-shadow: 0 0 15px rgba(255,255,255,0.6); }
          }
          .animate-slideDownGlow {
            animation: slideDownGlow 1.2s ease-out forwards;
          }

          @keyframes slideUp {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-slideUp {
            animation: slideUp 1.2s ease-out 0.3s forwards;
          }

          @keyframes float {
            0% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0); }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
}

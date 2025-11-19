import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-700">
      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 
        backdrop-blur-xl bg-white/10 border-b border-white/20
        shadow-lg"
      >
        <h1 className="text-3xl font-bold text-white tracking-wide drop-shadow-md">
          E-Commerce Platform
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center min-h-screen px-6 pt-28 text-white">
        {/* Title Section */}
        <h2 className="text-4xl font-extrabold drop-shadow-lg animate-fadeInSlow">
          Welcome to Our E-Commerce Platform
        </h2>

        <p className="text-lg opacity-90 mt-3 animate-slideUp delay-100">
          Choose your account type to get started
        </p>

        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-5xl w-full animate-fadeInSlow">
          {/* Seller Card */}
          <div
            className="p-8 text-center bg-white/10 backdrop-blur-xl border border-white/20 
            rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-purple-400/40 animate-float"
          >
            <div className="text-6xl mb-3">🏪</div>

            <h3 className="text-2xl font-bold mb-2 text-white">
              Seller Account
            </h3>

            <p className="text-white/80 mb-6">
              Sell your products and manage your inventory
            </p>

            <div className="flex gap-4 justify-center">
              <Link
                to="/seller/sign-in"
                className="
                  px-6 py-2 bg-indigo-600 rounded-lg text-white font-semibold 
                  transition-all duration-300 hover:bg-indigo-700 hover:scale-105 active:scale-95
                "
              >
                Sign In
              </Link>

              <Link
                to="/seller/sign-up"
                className="
                  px-6 py-2 bg-white/20 border border-white/40 rounded-lg 
                  text-white font-semibold transition-all duration-300 
                  hover:bg-indigo-600 hover:border-indigo-400 hover:scale-105 active:scale-95
                "
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Buyer Card */}
          <div
            className="p-8 text-center bg-white/10 backdrop-blur-xl border border-white/20 
            rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-green-400/40 animate-float delay-200"
          >
            <div className="text-6xl mb-3">🛒</div>

            <h3 className="text-2xl font-bold mb-2 text-white">
              Buyer Account
            </h3>

            <p className="text-white/80 mb-6">
              Browse and purchase products from our sellers
            </p>

            <div className="flex gap-4 justify-center">
              <Link
                to="/buyer/sign-in"
                className="
                  px-6 py-2 bg-emerald-500 rounded-lg text-white font-semibold 
                  transition-all duration-300 hover:bg-emerald-600 hover:scale-105 active:scale-95
                "
              >
                Sign In
              </Link>

              <Link
                to="/buyer/sign-up"
                className="
                  px-6 py-2 bg-white/20 border border-white/40 rounded-lg 
                  text-white font-semibold transition-all duration-300 
                  hover:bg-emerald-500 hover:border-emerald-300 hover:scale-105 active:scale-95
                "
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>

        {/* Admin Note */}
        <div
          className="
          mt-10 p-4 bg-white/10 backdrop-blur-xl border border-white/20 
          rounded-xl max-w-xl text-center shadow-lg animate-slideUp delay-300
        "
        >
          <p className="text-indigo-200">
            <strong className="text-white">Administrator Access:</strong>
            Users with email
            <span className="font-semibold text-yellow-300">
              {" "}
              kartikparmar9773@gmail.com{" "}
            </span>
            will be automatically recognized as admins.
          </p>
        </div>
      </main>

      {/* Custom Animations */}
      <style>
        {`
          @keyframes fadeInSlow {
            0% { opacity: 0; transform: translateY(20px) }
            100% { opacity: 1; transform: translateY(0) }
          }
          .animate-fadeInSlow {
            animation: fadeInSlow 1.2s ease-out forwards;
          }

          @keyframes slideUp {
            0% { opacity: 0; transform: translateY(40px) }
            100% { opacity: 1; transform: translateY(0) }
          }
          .animate-slideUp {
            animation: slideUp 1.2s ease-out forwards;
          }
          .delay-100 { animation-delay: 0.2s }
          .delay-200 { animation-delay: 0.4s }
          .delay-300 { animation-delay: 0.6s }

          @keyframes float {
            0% { transform: translateY(0) }
            50% { transform: translateY(-10px) }
            100% { transform: translateY(0) }
          }
          .animate-float {
            animation: float 3.5s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authService } from "../_service/authService";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItemsCount } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Periksa status login setiap kali rute berpindah
  useEffect(() => {
    const token = authService.getToken();
    const role = authService.getRole();
    setIsLoggedIn(!!token);
    setUserRole(role);
  }, [location]);

  const handleLogout = async () => {
    await authService.logout();
    setIsLoggedIn(false);
    setUserRole(null);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40">
      <nav className="bg-white border-b border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800 dark:border-gray-700 shadow-sm">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="self-center text-xl font-bold whitespace-nowrap text-indigo-600 dark:text-white">
              BookSales
            </span>
          </Link>

          {/* Right Action Buttons */}
          <div className="flex items-center lg:order-2 gap-2">
            {/* Tombol Keranjang */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white transition rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Keranjang Belanja"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {totalItemsCount > 0 && (
                <span className="absolute top-1 right-1 inline-flex items-center justify-center min-w-5 h-5 px-1 text-[11px] font-bold text-white bg-indigo-600 rounded-full">
                  {totalItemsCount > 99 ? "99+" : totalItemsCount}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                {/* Badge Role */}
                <span className="hidden sm:inline-block px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800">
                  {userRole === "admin" ? "Administrator" : "Customer"}
                </span>

                {/* Shortcut ke Admin jika admin */}
                {userRole === "admin" && (
                  <Link
                    to="/admin"
                    className="text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition"
                  >
                    Dashboard Admin
                  </Link>
                )}

                {/* Tombol Logout */}
                <button
                  onClick={handleLogout}
                  type="button"
                  className="text-xs sm:text-sm font-medium text-red-600 hover:text-white hover:bg-red-600 border border-red-500 rounded-lg px-3 py-1.5 transition dark:text-red-400 dark:border-red-500 dark:hover:bg-red-600 dark:hover:text-white"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-gray-800 dark:text-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2 dark:hover:bg-gray-700"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-indigo-600 dark:hover:bg-indigo-700"
                >
                  Bergabung
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 ml-1"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Toggle navigation</span>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Nav Links */}
          <div
            className={`${mobileMenuOpen ? "block" : "hidden"
              } justify-between items-center w-full lg:flex lg:w-auto lg:order-1`}
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <Link
                  to="/"
                  className={`block py-2 pr-4 pl-3 rounded lg:p-0 ${location.pathname === "/"
                      ? "text-indigo-600 font-bold dark:text-white"
                      : "text-gray-700 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-white"
                    }`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/books"
                  className={`block py-2 pr-4 pl-3 rounded lg:p-0 ${location.pathname.startsWith("/books")
                      ? "text-indigo-600 font-bold dark:text-white"
                      : "text-gray-700 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-white"
                    }`}
                >
                  Koleksi Buku
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className={`block py-2 pr-4 pl-3 rounded lg:p-0 ${
                    location.pathname === "/about"
                      ? "text-indigo-600 font-bold dark:text-white"
                      : "text-gray-700 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-white"
                  }`}
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className={`block py-2 pr-4 pl-3 rounded lg:p-0 ${
                    location.pathname === "/contact"
                      ? "text-indigo-600 font-bold dark:text-white"
                      : "text-gray-700 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-white"
                  }`}
                >
                  Kontak
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

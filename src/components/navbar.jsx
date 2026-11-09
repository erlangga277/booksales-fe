import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authService } from "../_service/authService";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
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
          <Link to="/" className="flex items-center">
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="mr-3 h-6 sm:h-9"
              alt="Logo"
            />
            <span className="self-center text-xl font-bold whitespace-nowrap text-indigo-600 dark:text-white">
              BookSales
            </span>
          </Link>

          {/* Right Action Buttons */}
          <div className="flex items-center lg:order-2 gap-2">
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
                <a
                  href="#about"
                  className="block py-2 pr-4 pl-3 text-gray-700 hover:text-indigo-600 lg:p-0 dark:text-gray-400 dark:hover:text-white"
                >
                  Tentang Kami
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

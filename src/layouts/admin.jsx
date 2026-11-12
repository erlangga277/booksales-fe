import { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { authService } from "../_service/authService";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await authService.logout();
    navigate("/login");
  };

  const navLinks = [
    {
      to: "/admin",
      label: "Dashboard",
      icon: (
        <svg
          aria-hidden="true"
          className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
        </svg>
      ),
      exact: true,
    },
    {
      to: "/admin/books",
      label: "Kelola Buku",
      icon: (
        <svg
          aria-hidden="true"
          className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
          <path
            fillRule="evenodd"
            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
            clipRule="evenodd"
          ></path>
        </svg>
      ),
    },
    {
      to: "/admin/authors",
      label: "Authors",
      icon: (
        <svg
          aria-hidden="true"
          className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          ></path>
        </svg>
      ),
    },
    {
      to: "/admin/genres",
      label: "Genres",
      icon: (
        <svg
          aria-hidden="true"
          className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          ></path>
        </svg>
      ),
    },
    {
      to: "/admin/users",
      label: "Daftar User",
      icon: (
        <svg aria-hidden="true" className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
    },
    {
      to: "/admin/transactions",
      label: "Pesanan Buku",
      icon: (
        <svg aria-hidden="true" className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      to: "/admin/messages",
      label: "Pesan Masuk",
      icon: (
        <svg aria-hidden="true" className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="antialiased bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex justify-start items-center">
            {/* Sidebar toggle mobile */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <svg
                aria-hidden="true"
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>

            <Link to="/admin" className="flex items-center gap-2.5 mr-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="self-center text-xl font-bold whitespace-nowrap text-indigo-600 dark:text-white">
                BookSales Admin
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Shortcut ke Public Store */}
            <Link
              to="/"
              className="hidden sm:inline-flex items-center text-xs font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50"
            >
              ← Lihat Toko Publik
            </Link>

            {/* User Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex mx-2 text-sm bg-indigo-600 text-white rounded-full p-1 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                id="user-menu-button"
              >
                <span className="sr-only">Open user menu</span>
                <img
                  className="w-8 h-8 rounded-full"
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gough.png"
                  alt="Admin Avatar"
                />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 z-50 py-1">
                  <div className="py-2 px-4 border-b border-gray-100 dark:border-gray-600">
                    <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                      Administrator
                    </span>
                    <span className="block text-xs text-gray-500 truncate dark:text-gray-400">
                      admin@mail.com
                    </span>
                  </div>
                  <ul>
                    <li>
                      <Link
                        to="/"
                        onClick={() => setDropdownOpen(false)}
                        className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                      >
                        Kunjungi Toko
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block py-2 px-4 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-600"
                      >
                        Keluar (Logout)
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700`}
        aria-label="Sidenav"
      >
        <div className="overflow-y-auto py-5 px-3 h-full flex flex-col justify-between">
          <ul className="space-y-2">
            {navLinks.map((link) => {
              const isActive = link.exact
                ? location.pathname === link.to
                : location.pathname.startsWith(link.to);

              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center p-2 text-sm font-medium rounded-lg transition group ${isActive
                      ? "bg-indigo-50 text-indigo-700 font-bold dark:bg-indigo-900/40 dark:text-indigo-300"
                      : "text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                      }`}
                  >
                    {link.icon}
                    <span className="ml-3">{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Sidebar Footer Logout Button */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center p-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition group"
            >
              <svg
                className="w-6 h-6 text-red-500 transition duration-75 group-hover:text-red-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="ml-3">Keluar (Logout)</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="p-4 md:ml-64 h-auto pt-20">
        <div className="rounded-lg h-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="mx-auto max-w-screen-xl px-4 py-8 md:py-12 lg:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <span className="self-center text-xl font-bold whitespace-nowrap text-indigo-600 dark:text-white">
                BookSales
              </span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
              Platform penjualan buku terpercaya dengan koleksi terlengkap, proses pembelian mudah, dan pengiriman aman.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              Belanja
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link to="/books" className="hover:text-indigo-600 dark:hover:text-white transition">
                  Katalog Buku
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-indigo-600 dark:hover:text-white transition">
                  Kategori
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-indigo-600 dark:hover:text-white transition">
                  Keranjang Belanja
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              Bantuan
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link to="/about" className="hover:text-indigo-600 dark:hover:text-white transition">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-indigo-600 dark:hover:text-white transition">
                  Kontak
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-indigo-600 dark:hover:text-white transition">
                  FAQ & Ketentuan
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          © {currentYear} BookSales. Seluruh hak cipta dilindungi.
        </div>
      </div>
    </footer>
  );
}

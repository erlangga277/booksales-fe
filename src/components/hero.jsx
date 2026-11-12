import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      <div className="py-12 px-4 mx-auto max-w-screen-xl lg:py-20 lg:px-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-medium text-indigo-700 bg-indigo-50 rounded-full dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900">
          <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
          Koleksi Buku Original & Terlengkap
        </div>

        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white max-w-4xl mx-auto">
          Temukan Buku Pilihan untuk Memperluas Cakrawala
        </h1>

        <p className="mb-8 text-base font-normal text-gray-600 sm:text-lg lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400 max-w-4xl mx-auto">
          Dari fiksi yang memikat, pengembangan diri, hingga sains dan teknologi. Dapatkan buku berkualitas dari penulis dan penerbit terpercaya dengan pengiriman cepat ke seluruh Indonesia.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12">
          <Link
            to="/books"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-900 transition"
          >
            Jelajahi Katalog Buku
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
          <Link
            to="/about"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition"
          >
            Tentang BookSales
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-gray-100 dark:border-gray-800 text-left max-w-4xl mx-auto">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">100% Buku Asli</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Buku baru dan segel resmi langsung dari penerbit terpercaya.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Pengiriman Cepat</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Packing aman lapis bubble wrap, dikirim di hari yang sama.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Koleksi Terkurasi</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Ragam genre dari sastra, bisnis, sains, hingga self-help.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

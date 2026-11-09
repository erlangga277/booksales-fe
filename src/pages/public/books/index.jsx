import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { bookService } from "../../../_service/bookService";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const getImageUrl = (path) => {
    if (!path) return "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&q=80";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const backendUrl = import.meta.env.VITE_API_BASE_URL
      ? import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "")
      : "http://localhost:8000";
    return `${backendUrl}/storage/${path}`;
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await bookService.getAll();
        setBooks(res.data || []);
      } catch (err) {
        console.error("Gagal mengambil data buku:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) => {
    const term = search.toLowerCase();
    const titleMatch = book.title?.toLowerCase().includes(term);
    const authorMatch = book.author?.name?.toLowerCase().includes(term);
    const genreMatch = book.genre?.name?.toLowerCase().includes(term);
    return titleMatch || authorMatch || genreMatch;
  });

  return (
    <section className="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-12 min-h-screen">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        {/* Header & Search */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Koleksi Buku
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Temukan berbagai buku pilihan terbaik dari penulis ternama
            </p>
          </div>

          <div className="w-full md:w-72">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari judul, penulis, genre..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
            <svg
              className="w-10 h-10 animate-spin text-indigo-600 mb-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            <p>Memuat koleksi buku...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
              Tidak ada buku yang ditemukan
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Coba kata kunci pencarian yang lain.
            </p>
          </div>
        ) : (
          /* Grid Buku */
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                <div>
                  {/* Cover Buku */}
                  <Link
                    to={`/books/${book.id}`}
                    className="block overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700 h-64 w-full mb-4"
                  >
                    <img
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      src={getImageUrl(book.cover_photo)}
                      alt={book.title}
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&q=80";
                      }}
                    />
                  </Link>

                  {/* Genre Badge */}
                  {book.genre?.name && (
                    <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-indigo-900/40 dark:text-indigo-300 mb-2">
                      {book.genre.name}
                    </span>
                  )}

                  {/* Judul Buku */}
                  <Link
                    to={`/books/${book.id}`}
                    className="block text-base font-bold leading-tight text-gray-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400 line-clamp-1 mb-1"
                  >
                    {book.title}
                  </Link>

                  {/* Author */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Oleh:{" "}
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {book.author?.name || "Penulis Tidak Diketahui"}
                    </span>
                  </p>

                  {/* Deskripsi Singkat */}
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                    {book.description || "Tidak ada deskripsi tersedia."}
                  </p>
                </div>

                <div>
                  {/* Harga & Stok */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div>
                      <p className="text-xs text-gray-400">Harga</p>
                      <p className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                        Rp {Number(book.price || 0).toLocaleString("id-ID")}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded font-medium">
                      Stok: {book.stock}
                    </span>
                  </div>

                  {/* Tombol Lihat Detail */}
                  <Link
                    to={`/books/${book.id}`}
                    className="mt-3 w-full inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700"
                  >
                    Lihat Detail
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { bookService } from "../../../_service/bookService";

export default function ShowBook() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getImageUrl = (path) => {
    if (!path) return "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const backendUrl = import.meta.env.VITE_API_BASE_URL
      ? import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "")
      : "http://localhost:8000";
    return `${backendUrl}/storage/${path}`;
  };

  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        setLoading(true);
        const res = await bookService.getById(id);
        setBook(res.data || null);
      } catch (err) {
        console.error("Gagal mengambil detail buku:", err);
        setError("Buku tidak ditemukan atau terjadi kesalahan server.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBookDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-gray-500 dark:text-gray-400 min-h-[60vh]">
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
        <p>Memuat detail buku...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="max-w-screen-xl px-4 py-20 mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          {error || "Buku tidak ditemukan"}
        </h2>
        <Link
          to="/books"
          className="inline-block mt-4 text-indigo-600 hover:underline font-medium text-sm"
        >
          ← Kembali ke katalog buku
        </Link>
      </div>
    );
  }

  return (
    <section className="py-8 bg-white md:py-16 dark:bg-gray-900 antialiased min-h-screen">
      <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
        {/* Breadcrumb sederhana */}
        <div className="mb-6 flex items-center text-sm text-gray-500 dark:text-gray-400 gap-2">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <span>/</span>
          <Link to="/books" className="hover:text-indigo-600">Buku</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium truncate max-w-xs sm:max-w-md">
            {book.title}
          </span>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-12 xl:gap-16 items-start">
          {/* Cover Buku */}
          <div className="shrink-0 max-w-md mx-auto w-full">
            <div className="overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700">
              <img
                className="w-full h-[450px] object-cover"
                src={getImageUrl(book.cover_photo)}
                alt={book.title}
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80";
                }}
              />
            </div>
          </div>

          {/* Info Buku */}
          <div className="mt-6 sm:mt-8 lg:mt-0">
            {/* Genre Badge */}
            {book.genre?.name && (
              <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full dark:bg-indigo-900/40 dark:text-indigo-300 mb-3">
                {book.genre.name}
              </span>
            )}

            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white mb-2">
              {book.title}
            </h1>

            {/* Author info */}
            <div className="flex items-center gap-3 my-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
              <img
                src={
                  book.author?.photo ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    book.author?.name || "Author"
                  )}&background=6366f1&color=fff`
                }
                alt={book.author?.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Penulis</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {book.author?.name || "Penulis Tidak Diketahui"}
                </p>
              </div>
            </div>

            {/* Harga */}
            <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
              <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                Rp {Number(book.price || 0).toLocaleString("id-ID")}
              </p>
              <span className="inline-block mt-2 sm:mt-0 px-3 py-1 text-xs font-medium rounded-md bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                Tersedia ({book.stock} stok)
              </span>
            </div>

            {/* Action buttons */}
            <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
              <button
                type="button"
                className="w-full sm:w-auto text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-6 py-3 flex items-center justify-center gap-2 dark:bg-indigo-600 dark:hover:bg-indigo-700"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"
                  />
                </svg>
                Beli Sekarang
              </button>

              <Link
                to="/books"
                className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                ← Kembali ke Katalog
              </Link>
            </div>

            <hr className="my-6 border-gray-200 dark:border-gray-800" />

            {/* Deskripsi */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                Sinopsis & Deskripsi
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {book.description || "Belum ada deskripsi untuk buku ini."}
              </p>
            </div>

            {/* Bio Author jika ada */}
            {book.author?.bio && (
              <div className="mt-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Tentang Penulis
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                  "{book.author.bio}"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

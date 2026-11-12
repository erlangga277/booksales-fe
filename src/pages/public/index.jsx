import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../../components/hero";
import Testimonial from "../../components/testimonial";
import { bookService } from "../../_service/bookService";

export default function Home() {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

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
        const res = await bookService.getAll();
        setFeaturedBooks((res.data || []).slice(0, 4));
      } catch (err) {
        console.error("Gagal memuat rekomendasi buku:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900">
      <Hero />

      <section className="py-12 px-4 mx-auto max-w-screen-xl lg:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              Rekomendasi Pilihan
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Buku-buku populer yang banyak dicari pembaca minggu ini
            </p>
          </div>
          <Link
            to="/books"
            className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
          >
            Lihat Semua Buku
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-sm text-gray-400">Memuat koleksi buku...</div>
        ) : featuredBooks.length === 0 ? (
          <div className="text-center py-12 text-sm text-gray-400">Belum ada buku tersedia.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {featuredBooks.map((book) => (
              <div
                key={book.id}
                className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-800/60"
              >
                <div>
                  <Link
                    to={`/books/${book.id}`}
                    className="block overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700 h-60 w-full mb-4"
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

                  {book.genre?.name && (
                    <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-indigo-950/60 dark:text-indigo-300 mb-2">
                      {book.genre.name}
                    </span>
                  )}

                  <Link
                    to={`/books/${book.id}`}
                    className="block text-base font-bold text-gray-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400 line-clamp-1 mb-1"
                  >
                    {book.title}
                  </Link>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Oleh: <span className="text-gray-700 dark:text-gray-300">{book.author?.name || "Penulis"}</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-150 dark:border-gray-700/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-400 block">Harga</span>
                    <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                      Rp {Number(book.price || 0).toLocaleString("id-ID")}
                    </span>
                  </div>
                  <Link
                    to={`/books/${book.id}`}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
                  >
                    Lihat
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Testimonial />
    </div>
  );
}

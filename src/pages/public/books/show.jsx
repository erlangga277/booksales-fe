import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { bookService } from "../../../_service/bookService";
import { transactionService } from "../../../_service/transactionService";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";

export default function ShowBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [buying, setBuying] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [snapToken, setSnapToken] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [quantity, setQuantity] = useState(1);
  const [cartFeedback, setCartFeedback] = useState(false);

  const storageKey = `pending_payment_book_${id}`;

  const fetchBookDetail = useCallback(async () => {
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
  }, [id]);

  const triggerSnapPay = useCallback((token, order) => {
    if (!window.snap || !token) return;

    window.snap.pay(token, {
      onSuccess: async () => {
        try {
          if (order?.id) {
            await transactionService.simulatePaid(order.id);
          }
        } catch (err) {
          console.error("Gagal sinkronisasi status pembayaran:", err);
        } finally {
          setPaymentStatus("success");
          localStorage.removeItem(storageKey);
          fetchBookDetail();
        }
      },
      onPending: () => {
        setPaymentStatus("pending");
      },
      onError: () => {
        alert("Pembayaran gagal. Silakan coba kembali.");
      },
      onClose: () => {},
    });
  }, [storageKey, fetchBookDetail]);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.status === "success") {
          localStorage.removeItem(storageKey);
        } else if (parsed.order && parsed.token) {
          setOrderData(parsed.order);
          setSnapToken(parsed.token);
          setPaymentStatus(parsed.status || "pending");
        }
      } catch {
        localStorage.removeItem(storageKey);
      }
    }
  }, [storageKey]);

  const getImageUrl = (path) => {
    if (!path) return "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const backendUrl = import.meta.env.VITE_API_BASE_URL
      ? import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "")
      : "http://localhost:8000";
    return `${backendUrl}/storage/${path}`;
  };

  useEffect(() => {
    if (id) {
      fetchBookDetail();
    }
  }, [id, fetchBookDetail]);

  const handleQuantityChange = (val) => {
    const nextVal = Number(val);
    if (isNaN(nextVal) || nextVal < 1) {
      setQuantity(1);
      return;
    }
    if (book && nextVal > book.stock) {
      setQuantity(book.stock);
      return;
    }
    setQuantity(nextVal);
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    if (!book || book.stock <= 0) return;
    addToCart(book, quantity);
    setCartFeedback(true);
    setTimeout(() => setCartFeedback(false), 2000);
  };

  const handleBuy = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    if (book.stock <= 0) {
      alert("Maaf, stok buku ini sedang habis.");
      return;
    }

    const totalCost = Number(book.price) * quantity;
    const confirmBuy = window.confirm(
      `Konfirmasi pemesanan ${quantity}x "${book.title}" seharga Rp ${totalCost.toLocaleString("id-ID")}?`
    );
    if (!confirmBuy) return;

    try {
      setBuying(true);
      const res = await transactionService.create({
        book_id: book.id,
        quantity: quantity,
        total_amount: totalCost,
      });

      const responseData = res.data?.data || res.data;
      const order = responseData?.order || responseData;
      const token = responseData?.snap_token || order?.snap_token;

      setOrderData(order);
      setSnapToken(token ?? null);
      setPaymentStatus("pending");

      localStorage.setItem(
        storageKey,
        JSON.stringify({ order, token, status: "pending" })
      );

      if (token) {
        triggerSnapPay(token, order);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Gagal memproses pesanan. Silakan coba lagi.");
    } finally {
      setBuying(false);
    }
  };

  const clearPendingSession = () => {
    localStorage.removeItem(storageKey);
    setOrderData(null);
    setSnapToken(null);
    setPaymentStatus("pending");
  };

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
        <div className="mb-6 flex items-center text-sm text-gray-500 dark:text-gray-400 gap-2">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <span>/</span>
          <Link to="/books" className="hover:text-indigo-600">Buku</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium truncate max-w-xs sm:max-w-md">
            {book.title}
          </span>
        </div>

        {orderData && (
          <div
            className={`mb-6 p-5 rounded-2xl border ${
              paymentStatus === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
                : "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-base mb-1">
                  {paymentStatus === "success"
                    ? "Pembayaran Berhasil Dikonfirmasi!"
                    : "Pesanan Dibuat — Selesaikan Pembayaran"}
                </h4>
                <p className="text-sm">
                  Nomor pesanan:{" "}
                  <span className="font-mono font-bold">{orderData.order_number}</span>.{" "}
                  {paymentStatus === "success"
                    ? "Transaksi Anda telah lunas dan stok buku telah diperbarui."
                    : "Selesaikan transaksi melalui pop-up Midtrans."}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {paymentStatus !== "success" && snapToken && (
                  <button
                    type="button"
                    onClick={() => triggerSnapPay(snapToken, orderData)}
                    className="inline-flex items-center gap-2 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-xl transition shadow-sm"
                  >
                    Lanjutkan Pembayaran
                  </button>
                )}

                <button
                  type="button"
                  onClick={clearPendingSession}
                  className="text-xs px-3 py-2 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 underline"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="lg:grid lg:grid-cols-2 lg:gap-12 xl:gap-16 items-start">
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

          <div className="mt-6 sm:mt-8 lg:mt-0">
            {book.genre?.name && (
              <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full dark:bg-indigo-900/40 dark:text-indigo-300 mb-3">
                {book.genre.name}
              </span>
            )}

            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white mb-2">
              {book.title}
            </h1>

            <div className="flex items-center gap-3 my-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
              <img
                src={
                  book.author?.photo
                    ? getImageUrl(book.author.photo)
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        book.author?.name || "Author"
                      )}&background=6366f1&color=fff`
                }
                alt={book.author?.name || "Penulis"}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    book.author?.name || "Author"
                  )}&background=6366f1&color=fff`;
                }}
                className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
              />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Penulis</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {book.author?.name || "Penulis Tidak Diketahui"}
                </p>
              </div>
            </div>

            <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
              <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                Rp {Number(book.price || 0).toLocaleString("id-ID")}
              </p>
              <span className={`inline-block mt-2 sm:mt-0 px-3 py-1 text-xs font-medium rounded-md ${
                book.stock > 0
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
              }`}>
                {book.stock > 0 ? `Tersedia (${book.stock} stok)` : "Stok Habis"}
              </span>
            </div>

            {!isAuthenticated && (
              <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-center justify-between">
                <span>Silakan login terlebih dahulu untuk menambahkan ke keranjang atau membeli buku.</span>
                <Link
                  to="/login"
                  state={{ from: location.pathname }}
                  className="font-bold underline ml-2 shrink-0 hover:text-amber-900 dark:hover:text-amber-200"
                >
                  Masuk Sekarang
                </Link>
              </div>
            )}

            {/* Atur Jumlah Pembelian */}
            <div className="mt-6 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <label htmlFor="quantity-input" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Jumlah:
                  </label>
                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1 || book.stock <= 0}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 disabled:opacity-40 transition font-bold"
                    >
                      -
                    </button>
                    <input
                      id="quantity-input"
                      type="number"
                      min="1"
                      max={book.stock}
                      value={quantity}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      disabled={book.stock <= 0}
                      className="w-14 text-center border-none py-1.5 text-sm dark:bg-gray-800 dark:text-white focus:ring-0 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= book.stock || book.stock <= 0}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 disabled:opacity-40 transition font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block">Subtotal:</span>
                  <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    Rp {(Number(book.price || 0) * quantity).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:gap-4 sm:items-center sm:flex">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={book.stock <= 0}
                className="w-full sm:w-auto text-indigo-600 bg-white border border-indigo-600 hover:bg-indigo-50 focus:ring-4 focus:ring-indigo-100 font-medium rounded-lg text-sm px-6 py-3 flex items-center justify-center gap-2 dark:bg-transparent dark:text-indigo-400 dark:border-indigo-400 dark:hover:bg-indigo-950/40 disabled:opacity-50 transition"
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
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cartFeedback ? "Berhasil Ditambahkan!" : "+ Keranjang"}
              </button>

              <button
                type="button"
                onClick={handleBuy}
                disabled={buying || book.stock <= 0}
                className="mt-3 sm:mt-0 w-full sm:w-auto text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-6 py-3 flex items-center justify-center gap-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 disabled:opacity-50 transition"
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                {buying ? "Memproses..." : isAuthenticated ? "Beli Sekarang" : "Login untuk Membeli"}
              </button>

              <Link
                to="/books"
                className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition"
              >
                ← Katalog
              </Link>
            </div>

            <div className="mt-5 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                  />
                </svg>
              </div>
              <div className="text-xs">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
                  Estimasi Tiba: 5 Hari Kerja (
                  {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                  )
                </span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  Pesanan diproses langsung dan dikirim menggunakan kurir reguler.
                </span>
              </div>
            </div>

            <hr className="my-6 border-gray-200 dark:border-gray-800" />

            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                Sinopsis & Deskripsi
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {book.description || "Belum ada deskripsi untuk buku ini."}
              </p>
            </div>

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

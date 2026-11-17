import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { transactionService } from "../../_service/transactionService";

const CART_PAYMENT_STORAGE_KEY = "pending_cart_payment";

export default function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalPrice } =
    useCart();
  const [submitting, setSubmitting] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [snapToken, setSnapToken] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("pending");

  const triggerSnapPay = useCallback((token, order) => {
    if (!window.snap || !token) return;

    window.snap.pay(token, {
      onSuccess: async () => {
        try {
          const orderId = Array.isArray(order) ? order[0]?.id : order?.id;
          if (orderId) {
            await transactionService.simulatePaid(orderId);
          }
        } catch (err) {
          console.error("Gagal sinkronisasi status pembayaran:", err);
        } finally {
          setPaymentStatus("success");
          localStorage.removeItem(CART_PAYMENT_STORAGE_KEY);
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
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(CART_PAYMENT_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.status === "success") {
          localStorage.removeItem(CART_PAYMENT_STORAGE_KEY);
        } else if (parsed.order && parsed.token) {
          setOrderData(parsed.order);
          setSnapToken(parsed.token);
          setPaymentStatus(parsed.status || "pending");
        }
      } catch {
        localStorage.removeItem(CART_PAYMENT_STORAGE_KEY);
      }
    }
  }, []);

  const getImageUrl = (path) => {
    if (!path)
      return "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const backendUrl = import.meta.env.VITE_API_BASE_URL
      ? import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "")
      : "http://localhost:8000";
    return `${backendUrl}/storage/${path}`;
  };

  const handleCheckout = async () => {
    if (!user) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    if (cartItems.length === 0) return;

    const confirmCheckout = window.confirm(
      `Lanjutkan checkout untuk ${cartItems.length} jenis buku dengan total Rp ${totalPrice.toLocaleString(
        "id-ID"
      )}?`
    );
    if (!confirmCheckout) return;

    try {
      setSubmitting(true);
      const itemsPayload = cartItems.map((item) => ({
        book_id: item.id,
        quantity: item.quantity,
      }));

      const res = await transactionService.create({
        items: itemsPayload,
      });

      const responseData = res.data?.data || res.data;
      const order = responseData?.order || responseData;
      const token = responseData?.snap_token || order?.snap_token;

      clearCart();
      setOrderData(order);
      setSnapToken(token ?? null);
      setPaymentStatus("pending");

      localStorage.setItem(
        CART_PAYMENT_STORAGE_KEY,
        JSON.stringify({ order, token, status: "pending" })
      );

      if (token) {
        triggerSnapPay(token, order);
      }
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Gagal memproses pesanan. Pastikan stok masih mencukupi."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const clearPendingSession = () => {
    localStorage.removeItem(CART_PAYMENT_STORAGE_KEY);
    setOrderData(null);
    setSnapToken(null);
    setPaymentStatus("pending");
  };

  return (
    <section className="py-8 bg-white md:py-16 dark:bg-gray-900 antialiased min-h-[70vh]">
      <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl mb-6">
          Keranjang Belanja
        </h1>

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
                  <span className="font-mono font-bold">
                    {Array.isArray(orderData)
                      ? orderData[0]?.order_number
                      : orderData?.order_number}
                  </span>
                  .{" "}
                  {paymentStatus === "success"
                    ? "Transaksi Anda telah lunas dan pesanan sedang diproses."
                    : "Pembayaran belum selesai sampai Anda menyelesaikannya di pop-up Midtrans."}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {paymentStatus !== "success" && snapToken && (
                  <button
                    type="button"
                    onClick={() => triggerSnapPay(snapToken, orderData)}
                    className="inline-flex items-center gap-2 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-xl transition"
                  >
                    Buka Kembali Halaman Bayar
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

        {cartItems.length === 0 && !orderData ? (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
              Keranjang Anda masih kosong
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              Belum ada buku yang dimasukkan ke keranjang belanja.
            </p>
            <Link
              to="/books"
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
            >
              Lihat Katalog Buku
            </Link>
          </div>
        ) : cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
                >
                  <img
                    src={getImageUrl(item.cover_photo)}
                    alt={item.title}
                    className="w-24 h-32 object-cover rounded-lg shrink-0"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80";
                    }}
                  />

                  <div className="flex-1 w-full">
                    <Link
                      to={`/books/${item.id}`}
                      className="text-base font-semibold text-gray-900 dark:text-white hover:text-indigo-600 line-clamp-1"
                    >
                      {item.title}
                    </Link>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Harga Satuan: Rp {item.price.toLocaleString("id-ID")}
                    </p>

                    <div className="flex items-center justify-between mt-4">
                      {/* Kontrol Kuantitas */}
                      <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="px-2.5 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 disabled:opacity-40"
                        >
                          -
                        </button>
                        <span className="w-12 text-center text-sm font-medium text-gray-800 dark:text-gray-200">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.stock}
                          className="px-2.5 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                          Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-600 text-xs transition"
                          title="Hapus"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Ringkasan Belanja */}
            <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-fit shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Ringkasan Pesanan
              </h2>

              <div className="space-y-3 text-sm pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Total Jenis Buku</span>
                  <span>{cartItems.length}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Total Eksemplar</span>
                  <span>
                    {cartItems.reduce((acc, it) => acc + it.quantity, 0)} buku
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center py-4 text-base font-bold text-gray-900 dark:text-white">
                <span>Total Tagihan</span>
                <span className="text-indigo-600 dark:text-indigo-400 text-lg">
                  Rp {totalPrice.toLocaleString("id-ID")}
                </span>
              </div>

              {!user && (
                <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-lg mb-4">
                  Harap login akun terlebih dahulu sebelum melanjutkan pesanan.
                </p>
              )}

              <button
                type="button"
                onClick={handleCheckout}
                disabled={submitting || cartItems.length === 0}
                className="w-full py-3 px-4 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition"
              >
                {submitting
                  ? "Sedang Memproses..."
                  : user
                  ? "Checkout Sekarang"
                  : "Login untuk Checkout"}
              </button>

              <button
                type="button"
                onClick={clearCart}
                className="w-full mt-3 py-2 text-xs text-gray-500 hover:text-red-600 dark:text-gray-400 transition"
              >
                Kosongkan Keranjang
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

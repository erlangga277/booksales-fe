import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { messageService } from "../../_service/messageService";

export default function Contact() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      await messageService.send(formData);
      setSuccess(true);
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setError(err.customMessage || "Gagal mengirim pesan. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-white dark:bg-gray-900 min-h-screen py-12 antialiased">
      <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
        <h2 className="mb-4 text-3xl sm:text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">
          Hubungi Admin
        </h2>
        <p className="mb-8 lg:mb-12 font-light text-center text-gray-500 dark:text-gray-400 sm:text-lg">
          Ada pertanyaan seputar pesanan buku atau kendala akun? Kirimkan pesan Anda dan admin kami akan merespons langsung melalui WhatsApp.
        </p>

        {!user && (
          <div className="mb-8 p-5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200">
            <h3 className="font-semibold text-base mb-1">Akses Terbatas untuk Pengguna Terdaftar</h3>
            <p className="text-sm mb-4 text-amber-800 dark:text-amber-300">
              Anda harus masuk atau mendaftarkan akun terlebih dahulu agar dapat mengirimkan pesan kepada admin.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/login"
                state={{ from: location.pathname }}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
              >
                Masuk / Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 transition"
              >
                Daftar Akun Baru
              </Link>
            </div>
          </div>
        )}

        {success && (
          <div className="p-4 mb-6 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 border border-green-200 dark:border-green-800">
            Pesan Anda berhasil dikirim! Admin kami akan segera merespons via nomor WhatsApp Anda.
          </div>
        )}

        {error && (
          <div className="p-4 mb-6 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Nama Lengkap
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!user}
              required
              placeholder="Nama Anda"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!user}
                required
                placeholder="nama@email.com"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                No. WhatsApp (Aktif)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!user}
                required
                placeholder="08xxxxxxxxxx"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Subjek Pertanyaan
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              disabled={!user}
              required
              placeholder="Contoh: Konfirmasi status pengiriman buku"
              className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
            >
              Isi Pesan
            </label>
            <textarea
              id="message"
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              disabled={!user}
              required
              placeholder="Tuliskan pesan atau kendala Anda di sini..."
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="py-3 px-6 text-sm font-medium text-center text-white rounded-lg bg-indigo-600 sm:w-fit hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 disabled:opacity-50"
          >
            {submitting
              ? "Mengirim Pesan..."
              : user
              ? "Kirim Pesan"
              : "Login untuk Mengirim Pesan"}
          </button>
        </form>
      </div>
    </section>
  );
}

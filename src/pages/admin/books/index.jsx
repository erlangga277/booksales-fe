import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { bookService } from "../../../_service/bookService";

export default function AdminBooks() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await bookService.getAll();
      setBooks(Array.isArray(res) ? res : res.data || []);
    } catch (err) {
      console.error("Gagal mengambil data buku:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await bookService.delete(deleteId);
      setShowConfirm(false);
      setDeleteId(null);
      fetchBooks();
    } catch (err) {
      alert("Gagal menghapus buku. Buku mungkin terkait dengan data transaksi.");
    }
  };

  const filteredBooks = books.filter((book) => {
    const q = search.toLowerCase();
    const title = book.title?.toLowerCase() || "";
    const authorName = book.author?.name?.toLowerCase() || "";
    const genreName = book.genre?.name?.toLowerCase() || "";
    return title.includes(q) || authorName.includes(q) || genreName.includes(q);
  });

  return (
    <>
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              Konfirmasi Hapus
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5">
              Apakah kamu yakin ingin menghapus buku ini? Tindakan ini tidak bisa dibatalkan.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 bg-zinc-50 dark:bg-zinc-950 min-h-screen">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Kelola Buku
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Total {books.length} judul buku tersedia di katalog
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul, penulis, genre..."
              className="w-full sm:w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm rounded-lg px-3.5 py-2 focus:ring-1 focus:ring-indigo-500"
            />
            <button
              onClick={() => navigate("/admin/books/create")}
              type="button"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition"
            >
              + Tambah Buku
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-zinc-600 dark:text-zinc-400">
              <thead className="text-xs uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-3.5">Buku</th>
                  <th className="px-6 py-3.5">Penulis</th>
                  <th className="px-6 py-3.5">Genre</th>
                  <th className="px-6 py-3.5">Harga</th>
                  <th className="px-6 py-3.5">Stok</th>
                  <th className="px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-zinc-400">
                      Memuat daftar buku...
                    </td>
                  </tr>
                ) : filteredBooks.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-zinc-400">
                      Tidak ada buku ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredBooks.map((book) => (
                    <tr
                      key={book.id}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {book.cover_photo ? (
                            <img
                              src={book.cover_photo}
                              alt={book.title}
                              className="w-10 h-14 object-cover rounded shadow-sm border border-zinc-200 dark:border-zinc-700 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-14 bg-zinc-200 dark:bg-zinc-800 rounded flex items-center justify-center text-[10px] text-zinc-500 flex-shrink-0">
                              No Img
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-zinc-900 dark:text-zinc-100 line-clamp-1">
                              {book.title}
                            </div>
                            <div className="text-xs text-zinc-500 line-clamp-1 max-w-xs mt-0.5">
                              {book.description || "Tidak ada deskripsi"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                          {book.author?.name || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
                          {book.genre?.name || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100">
                        Rp {Number(book.price).toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded ${
                            book.stock > 5
                              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50"
                              : book.stock > 0
                              ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50"
                              : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50"
                          }`}
                        >
                          {book.stock} pcs
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button
                          onClick={() => navigate(`/admin/books/${book.id}/edit`)}
                          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(book.id)}
                          className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

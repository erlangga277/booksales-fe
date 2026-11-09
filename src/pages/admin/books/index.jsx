import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { bookService } from "../../../_service/bookService";

export default function AdminBooks() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getAll();
      setBooks(data.data || data);
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
      console.error("Gagal menghapus buku:", err);
    }
  };

  return (
    <>
      {/* Modal Konfirmasi Hapus */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Konfirmasi Hapus
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Apakah kamu yakin ingin menghapus buku ini? Tindakan ini tidak
              bisa dibatalkan.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
          {/* Header: Search + Tombol Tambah */}
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
            <div className="w-full md:w-1/2">
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                Daftar Buku
              </p>
            </div>
            <div className="w-full md:w-auto flex justify-end">
              <button
                onClick={() => navigate("/admin/books/create")}
                type="button"
                className="flex items-center justify-center text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-indigo-600 dark:hover:bg-indigo-700"
              >
                <svg
                  className="h-3.5 w-3.5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  />
                </svg>
                Tambah Buku
              </button>
            </div>
          </div>

          {/* Tabel */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-4 py-3">No</th>
                  <th className="px-4 py-3">Judul</th>
                  <th className="px-4 py-3">Genre</th>
                  <th className="px-4 py-3">Author</th>
                  <th className="px-4 py-3">Harga</th>
                  <th className="px-4 py-3">Stok</th>
                  <th className="px-4 py-3">
                    <span className="sr-only">Aksi</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-6 text-center text-gray-400"
                    >
                      Memuat data...
                    </td>
                  </tr>
                ) : books.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-6 text-center text-gray-400"
                    >
                      Belum ada buku.
                    </td>
                  </tr>
                ) : (
                  books.map((book, index) => (
                    <tr
                      key={book.id}
                      className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-4 py-3">{index + 1}</td>
                      <th
                        scope="row"
                        className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {book.title}
                      </th>
                      <td className="px-4 py-3">
                        {book.genre?.name || book.genre_id || "-"}
                      </td>
                      <td className="px-4 py-3">
                        {book.author?.name || book.author_id || "-"}
                      </td>
                      <td className="px-4 py-3">
                        Rp {Number(book.price).toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-3">{book.stock}</td>
                      <td className="px-4 py-3 flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            navigate(`/admin/books/${book.id}/edit`)
                          }
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(book.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 font-medium text-sm"
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
      </section>
    </>
  );
}

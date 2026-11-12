import { useEffect, useState } from "react";
import { genreService } from "../../../_service/genreService";

export default function AdminGenres() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchGenres = async () => {
    setLoading(true);
    try {
      const res = await genreService.getAll();
      setGenres(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedId(null);
    setForm({ name: "", description: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (genre) => {
    setModalMode("edit");
    setSelectedId(genre.id);
    setForm({
      name: genre.name || "",
      description: genre.description || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (modalMode === "create") {
        await genreService.create(form);
      } else {
        await genreService.update(selectedId, form);
      }
      setIsModalOpen(false);
      fetchGenres();
    } catch (err) {
      alert(err.customMessage || "Gagal menyimpan data genre.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Hapus genre "${name}"?`)) return;
    try {
      await genreService.delete(id);
      fetchGenres();
    } catch (err) {
      alert("Gagal menghapus genre. Genre mungkin terhubung dengan data buku.");
    }
  };

  const filteredGenres = genres.filter((g) => {
    const q = search.toLowerCase();
    return (
      g.name?.toLowerCase().includes(q) ||
      g.description?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 bg-zinc-50 dark:bg-zinc-950 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Kategori & Genre
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Total {genres.length} kategori buku terdaftar
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kategori atau deskripsi..."
            className="w-full sm:w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm rounded-lg px-3.5 py-2 focus:ring-1 focus:ring-indigo-500"
          />
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition"
          >
            + Tambah Genre
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-zinc-600 dark:text-zinc-400">
            <thead className="text-xs uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-3.5">Nama Genre</th>
                <th className="px-6 py-3.5">Deskripsi</th>
                <th className="px-6 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center py-12 text-zinc-400">
                    Memuat data genre...
                  </td>
                </tr>
              ) : filteredGenres.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-12 text-zinc-400">
                    Tidak ada genre ditemukan.
                  </td>
                </tr>
              ) : (
                filteredGenres.map((genre) => (
                  <tr
                    key={genre.id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition"
                  >
                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">
                      {genre.name}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 max-w-md">
                        {genre.description || "Belum ada deskripsi."}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button
                        onClick={() => openEditModal(genre)}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(genre.id, genre.name)}
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              {modalMode === "create" ? "Tambah Kategori" : "Edit Kategori"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Nama Genre
                </label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Deskripsi
                </label>
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  {submitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

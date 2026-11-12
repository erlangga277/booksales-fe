import { useEffect, useState } from "react";
import { authorService } from "../../../_service/authorService";

export default function AdminAuthors() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState({ name: "", photo: "", bio: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchAuthors = async () => {
    setLoading(true);
    try {
      const res = await authorService.getAll();
      setAuthors(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedId(null);
    setForm({ name: "", photo: "", bio: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (author) => {
    setModalMode("edit");
    setSelectedId(author.id);
    setForm({
      name: author.name || "",
      photo: author.photo || "",
      bio: author.bio || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (modalMode === "create") {
        await authorService.create(form);
      } else {
        await authorService.update(selectedId, form);
      }
      setIsModalOpen(false);
      fetchAuthors();
    } catch (err) {
      alert(err.customMessage || "Gagal menyimpan data penulis.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Hapus penulis "${name}"?`)) return;
    try {
      await authorService.delete(id);
      fetchAuthors();
    } catch (err) {
      alert("Gagal menghapus penulis. Penulis mungkin memiliki relasi dengan buku.");
    }
  };

  const filteredAuthors = authors.filter((a) => {
    const q = search.toLowerCase();
    return (
      a.name?.toLowerCase().includes(q) || a.bio?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 bg-zinc-50 dark:bg-zinc-950 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Penulis Buku
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Total {authors.length} penulis terdaftar di sistem
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau bio penulis..."
            className="w-full sm:w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm rounded-lg px-3.5 py-2 focus:ring-1 focus:ring-indigo-500"
          />
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition"
          >
            + Tambah Penulis
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-zinc-600 dark:text-zinc-400">
            <thead className="text-xs uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-3.5">Penulis</th>
                <th className="px-6 py-3.5">Biografi</th>
                <th className="px-6 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center py-12 text-zinc-400">
                    Memuat data penulis...
                  </td>
                </tr>
              ) : filteredAuthors.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-12 text-zinc-400">
                    Tidak ada penulis ditemukan.
                  </td>
                </tr>
              ) : (
                filteredAuthors.map((author) => (
                  <tr
                    key={author.id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {author.photo ? (
                          <img
                            src={author.photo}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-600 dark:text-zinc-400">
                            {author.name?.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                          {author.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 max-w-md">
                        {author.bio || "Belum ada informasi biografi."}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button
                        onClick={() => openEditModal(author)}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(author.id, author.name)}
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
              {modalMode === "create" ? "Tambah Penulis" : "Edit Penulis"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Nama Penulis
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
                  URL Foto Penulis
                </label>
                <input
                  type="url"
                  value={form.photo}
                  onChange={(e) => setForm({ ...form, photo: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Biografi Singkat
                </label>
                <textarea
                  rows="3"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
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

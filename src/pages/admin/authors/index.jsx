import { useEffect, useState } from "react";
import { authorService } from "../../../_service/authorService";
import { getImageUrl } from "../../../_utils/image";

export default function AdminAuthors() {
  const [authors, setAuthors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedId, setSelectedId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [photoType, setPhotoType] = useState("file");
  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [form, setForm] = useState({
    name: "",
    photo: "",
    bio: "",
  });

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const res = await authorService.getAll();
      setAuthors(Array.isArray(res) ? res : res.data || []);
    } catch (err) {
      console.error("Gagal mengambil data penulis:", err);
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
    setPhotoFile(null);
    setPreviewUrl("");
    setPhotoType("file");
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
    setPhotoFile(null);
    setPreviewUrl(author.photo ? getImageUrl(author.photo) : "");
    setPhotoType(author.photo?.startsWith("http") ? "url" : "file");
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("bio", form.bio || "");

      if (photoType === "file" && photoFile) {
        formData.append("photo", photoFile);
      } else if (photoType === "url" && form.photo) {
        formData.append("photo", form.photo);
      }

      if (modalMode === "create") {
        await authorService.create(formData);
      } else {
        await authorService.update(selectedId, formData);
      }
      setIsModalOpen(false);
      fetchAuthors();
    } catch (err) {
      alert(err.response?.data?.message || err.customMessage || "Gagal menyimpan data penulis.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Hapus penulis "${name}"?`)) return;
    try {
      await authorService.delete(id);
      fetchAuthors();
    } catch {
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
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm px-4 py-2.5 rounded-lg transition"
        >
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Tambah Penulis
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari berdasarkan nama atau biografi..."
          className="w-full sm:max-w-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-zinc-600 dark:text-zinc-400">
            <thead className="text-xs uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-3.5">Penulis</th>
                <th className="px-6 py-3.5">Biografi</th>
                <th className="px-6 py-3.5">Buku Terkait</th>
                <th className="px-6 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-12 text-zinc-400">
                    Memuat data penulis...
                  </td>
                </tr>
              ) : filteredAuthors.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-12 text-zinc-400">
                    Tidak ada data penulis ditemukan.
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
                            src={getImageUrl(author.photo)}
                            alt=""
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&q=80";
                            }}
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
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400">
                        {author.books?.length || 0} Buku
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(author)}
                          className="px-2.5 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(author.id, author.name)}
                          className="px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:underline"
                        >
                          Hapus
                        </button>
                      </div>
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
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                  Foto Penulis
                </label>
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setPhotoType("file")}
                    className={`text-xs px-3 py-1 rounded-md border transition ${
                      photoType === "file"
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-transparent hover:border-zinc-300"
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoType("url")}
                    className={`text-xs px-3 py-1 rounded-md border transition ${
                      photoType === "url"
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-transparent hover:border-zinc-300"
                    }`}
                  >
                    URL Gambar
                  </button>
                </div>

                {photoType === "file" ? (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-xs text-zinc-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                ) : (
                  <input
                    type="url"
                    value={form.photo}
                    onChange={(e) => {
                      setForm({ ...form, photo: e.target.value });
                      setPreviewUrl(e.target.value);
                    }}
                    placeholder="https://..."
                    className="w-full bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white"
                  />
                )}

                {previewUrl && (
                  <div className="mt-2.5 flex items-center gap-2">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-12 h-12 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 shadow-sm"
                    />
                    <span className="text-xs text-zinc-500">Preview foto</span>
                  </div>
                )}
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

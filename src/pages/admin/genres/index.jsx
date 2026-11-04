import { useEffect, useState, useMemo } from "react";
import { genreService } from "../../../_service/genreService";

export default function AdminGenres() {
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // Modal Form State (Create / Edit)
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create"); // 'create' | 'edit'
    const [selectedGenreId, setSelectedGenreId] = useState(null);
    const [form, setForm] = useState({ name: "", description: "" });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // Modal Delete State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [genreToDelete, setGenreToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Toast State
    const [toast, setToast] = useState(null);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchGenres = async () => {
        try {
            setLoading(true);
            const res = await genreService.getAll();
            setGenres(res.data || []);
        } catch (err) {
            showToast(err.customMessage || "Gagal memuat data genre", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGenres();
    }, []);

    const filteredGenres = useMemo(() => {
        if (!search.trim()) return genres;
        const q = search.toLowerCase();
        return genres.filter(
            (g) =>
                g.name?.toLowerCase().includes(q) ||
                g.description?.toLowerCase().includes(q)
        );
    }, [genres, search]);

    // Summary Stats
    const stats = useMemo(() => {
        const total = genres.length;
        const withDesc = genres.filter(g => g.description && g.description.trim() !== "").length;
        return { total, withDesc, withoutDesc: total - withDesc };
    }, [genres]);

    // --- Modal Create Handlers ---
    const handleOpenCreateModal = () => {
        setModalMode("create");
        setSelectedGenreId(null);
        setForm({ name: "", description: "" });
        setErrors({});
        setIsFormModalOpen(true);
    };

    // --- Modal Edit Handlers ---
    const handleOpenEditModal = (genre) => {
        setModalMode("edit");
        setSelectedGenreId(genre.id);
        setForm({
            name: genre.name || "",
            description: genre.description || "",
        });
        setErrors({});
        setIsFormModalOpen(true);
    };

    const handleCloseFormModal = () => {
        if (!submitting) {
            setIsFormModalOpen(false);
            setErrors({});
        }
    };

    // Tambahkan state error umum di dalam komponen
    const [generalError, setGeneralError] = useState("");

    // Di handleSubmit:
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setGeneralError("");

        if (!form.name.trim()) {
            setErrors({ name: ["Nama genre wajib diisi."] });
            return;
        }

        const payload = {
            name: form.name.trim(),
            description: form.description.trim() || null,
        };

        try {
            setSubmitting(true);
            if (modalMode === "create") {
                await genreService.create(payload);
                showToast("Genre baru berhasil ditambahkan!");
            } else {
                await genreService.update(selectedGenreId, payload);
                showToast("Data genre berhasil diperbarui!");
            }

            handleCloseFormModal();
            fetchGenres();
        } catch (err) {
            if (err.response?.status === 422 && err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else if (err.response?.status === 401) {
                setGeneralError("Akses Ditolak: Anda belum terautentikasi sebagai Admin. Silakan login terlebih dahulu.");
            } else {
                setGeneralError(err.customMessage || "Terjadi kesalahan saat menyimpan data.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    // --- Delete Handlers ---
    const handleOpenDeleteModal = (genre) => {
        setGenreToDelete(genre);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        if (!deleting) {
            setIsDeleteModalOpen(false);
            setGenreToDelete(null);
        }
    };

    const handleConfirmDelete = async () => {
        if (!genreToDelete) return;

        try {
            setDeleting(true);
            await genreService.delete(genreToDelete.id);
            showToast(`Genre "${genreToDelete.name}" berhasil dihapus!`);
            handleCloseDeleteModal();
            fetchGenres();
        } catch (err) {
            showToast(err.customMessage || "Gagal menghapus genre. Pastikan tidak ada buku terikat.", "error");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Toast Notification */}
            {toast && (
                <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg shadow-xl border transition-all animate-in fade-in slide-in-from-top-2 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700">
                    <span
                        className={`w-2.5 h-2.5 rounded-full ${toast.type === "success" ? "bg-emerald-500 animate-pulse" : "bg-rose-500 animate-pulse"
                            }`}
                    />
                    <span>{toast.message}</span>
                </div>
            )}

            {/* Header Halaman */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                            Kelola Genre Buku
                        </h1>
                        <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                            {genres.length} Kategori
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        Atur klasifikasi tema, kategori buku, update rincian, atau hapus kategori yang sudah tidak digunakan.
                    </p>
                </div>

                <button
                    onClick={handleOpenCreateModal}
                    type="button"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 active:scale-[0.98] transition shadow-sm cursor-pointer dark:focus:ring-indigo-900/50"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Genre Baru
                </button>
            </div>

            {/* Quick Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-indigo-50/50 to-white dark:from-zinc-900 dark:to-zinc-900 border border-indigo-100 dark:border-zinc-800 rounded-2xl">
                    <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">Total Kategori</p>
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{stats.total}</h3>
                </div>
                <div className="p-4 bg-gradient-to-br from-emerald-50/50 to-white dark:from-zinc-900 dark:to-zinc-900 border border-emerald-100 dark:border-zinc-800 rounded-2xl">
                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Dengan Deskripsi</p>
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{stats.withDesc}</h3>
                </div>
                <div className="p-4 bg-gradient-to-br from-amber-50/50 to-white dark:from-zinc-900 dark:to-zinc-900 border border-amber-100 dark:border-zinc-800 rounded-2xl">
                    <p className="text-xs font-medium text-amber-600 dark:text-amber-400">Deskripsi Kosong</p>
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{stats.withoutDesc}</h3>
                </div>
            </div>

            {/* Action Bar / Search */}
            <div className="flex items-center justify-between gap-3">
                <div className="relative w-full max-w-sm">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari genre berdasarkan nama atau info..."
                        className="w-full pl-10 pr-8 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-600"
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* Tabel Data Genre */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/50 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                <th scope="col" className="w-16 px-4 py-3.5 text-center">No</th>
                                <th scope="col" className="px-4 py-3.5">Nama Genre</th>
                                <th scope="col" className="px-4 py-3.5">Deskripsi</th>
                                <th scope="col" className="w-36 px-4 py-3.5">Dibuat Pada</th>
                                <th scope="col" className="w-32 px-4 py-3.5 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-sm">
                            {loading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-4 py-4 text-center"><div className="h-4 w-4 bg-zinc-200 dark:bg-zinc-800 rounded mx-auto" /></td>
                                        <td className="px-4 py-4"><div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" /></td>
                                        <td className="px-4 py-4"><div className="h-4 w-64 bg-zinc-200 dark:bg-zinc-800 rounded" /></td>
                                        <td className="px-4 py-4"><div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" /></td>
                                        <td className="px-4 py-4 text-center"><div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-800 rounded mx-auto" /></td>
                                    </tr>
                                ))
                            ) : filteredGenres.length > 0 ? (
                                filteredGenres.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/30 transition-colors">
                                        <td className="px-4 py-3.5 text-center font-mono text-xs text-zinc-400">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                                                {item.name}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-zinc-600 dark:text-zinc-400 max-w-md">
                                            {item.description ? (
                                                <p className="line-clamp-2 text-xs leading-relaxed">{item.description}</p>
                                            ) : (
                                                <span className="text-xs text-zinc-400 italic">Belum ada keterangan</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5 text-xs text-zinc-500 whitespace-nowrap">
                                            {item.created_at
                                                ? new Date(item.created_at).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })
                                                : "-"}
                                        </td>
                                        <td className="px-4 py-3.5 text-center">
                                            <div className="flex items-center justify-center gap-1.5">
                                                {/* Edit Button */}
                                                <button
                                                    onClick={() => handleOpenEditModal(item)}
                                                    title="Ubah Genre"
                                                    className="p-1.5 text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>

                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => handleOpenDeleteModal(item)}
                                                    title="Hapus Genre"
                                                    className="p-1.5 text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center">
                                        <div className="max-w-xs mx-auto space-y-2">
                                            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                                                {search ? "Genre tidak ditemukan" : "Belum ada genre"}
                                            </p>
                                            <p className="text-xs text-zinc-500">
                                                {search
                                                    ? `Tidak ada hasil yang sesuai dengan kata kunci "${search}".`
                                                    : "Mulai tambahkan kategori pertama untuk toko buku Anda."}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Form: Create / Edit Genre */}
            {isFormModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-xs">
                    <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
                            <div>
                                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                                    {modalMode === "create" ? "Tambah Genre Baru" : "Perbarui Data Genre"}
                                </h3>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    {modalMode === "create"
                                        ? "Buat kategori baru untuk mengelompokkan buku di toko."
                                        : `Mengubah data untuk genre ID #${selectedGenreId}`}
                                </p>
                            </div>
                            <button
                                onClick={handleCloseFormModal}
                                disabled={submitting}
                                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1.5 rounded-lg transition"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                                    Nama Genre <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="Contoh: Novel Klasik, Sains Populer"
                                    value={form.name}
                                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                                    className={`w-full px-3.5 py-2.5 text-sm bg-white dark:bg-zinc-800 border rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 transition ${errors.name
                                        ? "border-rose-400 focus:ring-rose-400/20"
                                        : "border-zinc-200 dark:border-zinc-700 focus:ring-indigo-500/20 focus:border-indigo-500"
                                        }`}
                                />
                                {errors.name && (
                                    <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.name[0]}</p>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                                        Deskripsi
                                    </label>
                                    <span className="text-[10px] text-zinc-400 font-mono">
                                        {form.description.length}/300
                                    </span>
                                </div>
                                <textarea
                                    rows={3}
                                    maxLength={300}
                                    placeholder="Penjelasan singkat mengenai kategori genre ini..."
                                    value={form.description}
                                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                                    className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-none"
                                />
                                {errors.description && (
                                    <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.description[0]}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                <button
                                    type="button"
                                    onClick={handleCloseFormModal}
                                    disabled={submitting}
                                    className="px-4 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-xl hover:bg-zinc-200 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-50 transition shadow-sm"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : modalMode === "create" ? (
                                        "Simpan Genre"
                                    ) : (
                                        "Simpan Perubahan"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Hapus Genre */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-xs">
                    <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
                        <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center mx-auto">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                                Konfirmasi Hapus Genre
                            </h3>
                            <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
                                Anda yakin ingin menghapus genre <strong className="text-zinc-800 dark:text-zinc-200 font-semibold">"{genreToDelete?.name}"</strong>? Data yang dihapus tidak dapat dipulihkan.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={handleCloseDeleteModal}
                                disabled={deleting}
                                className="flex-1 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-xl hover:bg-zinc-200 transition"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmDelete}
                                disabled={deleting}
                                className="flex-1 py-2 text-xs font-semibold text-white bg-rose-600 rounded-xl hover:bg-rose-700 active:scale-[0.99] disabled:opacity-50 transition shadow-sm inline-flex items-center justify-center gap-2"
                            >
                                {deleting ? (
                                    <>
                                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Menghapus...
                                    </>
                                ) : (
                                    "Ya, Hapus"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
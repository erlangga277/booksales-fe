import { useEffect, useState, useMemo } from "react";
import { authorService } from "../../../_service/authorService";

// Helper avatar inisial bila foto kosong / gagal load
function AuthorAvatar({ photo, name, size = "md" }) {
    const [imgError, setImgError] = useState(false);

    const initials = useMemo(() => {
        if (!name) return "A";
        const parts = name.trim().split(" ");
        return parts.length > 1
            ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
            : name.slice(0, 2).toUpperCase();
    }, [name]);

    const sizeClasses = {
        sm: "w-8 h-8 text-xs",
        md: "w-10 h-10 text-sm",
        lg: "w-16 h-16 text-base",
    }[size];

    if (photo && !imgError) {
        return (
            <img
                src={photo}
                alt={name}
                onError={() => setImgError(true)}
                className={`${sizeClasses} rounded-full object-cover border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800`}
            />
        );
    }

    return (
        <div
            className={`${sizeClasses} rounded-full flex items-center justify-center font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 select-none tracking-tight`}
        >
            {initials}
        </div>
    );
}

export default function AdminAuthors() {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState("table");

    // Modal Form State (Create / Edit)
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create"); // 'create' | 'edit'
    const [selectedAuthorId, setSelectedAuthorId] = useState(null);
    const [form, setForm] = useState({ name: "", photo: "", bio: "" });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // Modal Delete State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [authorToDelete, setAuthorToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Toast State
    const [toast, setToast] = useState(null);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchAuthors = async () => {
        try {
            setLoading(true);
            const res = await authorService.getAll();
            setAuthors(res.data || []);
        } catch (err) {
            showToast(err.customMessage || "Gagal memuat data author", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAuthors();
    }, []);

    const filteredAuthors = useMemo(() => {
        if (!search.trim()) return authors;
        const q = search.toLowerCase();
        return authors.filter(
            (a) =>
                a.name?.toLowerCase().includes(q) || a.bio?.toLowerCase().includes(q)
        );
    }, [authors, search]);

    // Modal Create
    const handleOpenCreateModal = () => {
        setModalMode("create");
        setSelectedAuthorId(null);
        setForm({ name: "", photo: "", bio: "" });
        setErrors({});
        setIsFormModalOpen(true);
    };

    // Modal Edit
    const handleOpenEditModal = (author) => {
        setModalMode("edit");
        setSelectedAuthorId(author.id);
        setForm({
            name: author.name || "",
            photo: author.photo || "",
            bio: author.bio || "",
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

    // Submit Create & Update
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        if (!form.name.trim()) {
            setErrors({ name: ["Nama penulis wajib diisi."] });
            return;
        }

        const payload = {
            name: form.name.trim(),
            photo: form.photo.trim() || null,
            bio: form.bio.trim() || null,
        };

        try {
            setSubmitting(true);
            if (modalMode === "create") {
                await authorService.create(payload);
                showToast("Data penulis baru berhasil ditambahkan!");
            } else {
                await authorService.update(selectedAuthorId, payload);
                showToast("Data penulis berhasil diperbarui!");
            }

            handleCloseFormModal();
            fetchAuthors();
        } catch (err) {
            if (err.response?.status === 422 && err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                showToast(
                    err.customMessage || `Gagal ${modalMode === "create" ? "menambahkan" : "memperbarui"} author.`,
                    "error"
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Modal Delete
    const handleOpenDeleteModal = (author) => {
        setAuthorToDelete(author);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        if (!deleting) {
            setIsDeleteModalOpen(false);
            setAuthorToDelete(null);
        }
    };

    const handleConfirmDelete = async () => {
        if (!authorToDelete) return;

        try {
            setDeleting(true);
            await authorService.delete(authorToDelete.id);
            showToast(`Penulis "${authorToDelete.name}" berhasil dihapus!`);
            handleCloseDeleteModal();
            fetchAuthors();
        } catch (err) {
            showToast(err.customMessage || "Gagal menghapus author. Pastikan tidak ada relasi buku.", "error");
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
                            Kelola Penulis (Authors)
                        </h1>
                        <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                            {authors.length} Penulis
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        Kelola profil lengkap kreator buku, perbarui biodata & foto, atau kelola katalog penulis.
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
                    Tambah Penulis Baru
                </button>
            </div>

            {/* Control Bar: Search & View Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                        placeholder="Cari nama atau biografi penulis..."
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

                {/* View Switcher: Table vs Cards */}
                <div className="inline-flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 self-start sm:self-auto">
                    <button
                        onClick={() => setViewMode("table")}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${viewMode === "table"
                            ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
                            : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                            }`}
                    >
                        Mode Tabel
                    </button>
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${viewMode === "grid"
                            ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
                            : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                            }`}
                    >
                        Kartu Galeri
                    </button>
                </div>
            </div>

            {/* Render Data: Mode Tabel atau Grid */}
            {viewMode === "table" ? (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/50 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                    <th scope="col" className="w-16 px-4 py-3.5 text-center">No</th>
                                    <th scope="col" className="px-4 py-3.5">Penulis</th>
                                    <th scope="col" className="px-4 py-3.5">Biografi</th>
                                    <th scope="col" className="w-28 px-4 py-3.5 text-center">Total Buku</th>
                                    <th scope="col" className="w-36 px-4 py-3.5">Terdaftar</th>
                                    <th scope="col" className="w-32 px-4 py-3.5 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-sm">
                                {loading ? (
                                    Array.from({ length: 4 }).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-4 py-4 text-center"><div className="h-4 w-4 bg-zinc-200 dark:bg-zinc-800 rounded mx-auto" /></td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                                                    <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                                </div>
                                            </td>
                                            <td className="px-4 py-4"><div className="h-4 w-52 bg-zinc-200 dark:bg-zinc-800 rounded" /></td>
                                            <td className="px-4 py-4 text-center"><div className="h-4 w-8 bg-zinc-200 dark:bg-zinc-800 rounded mx-auto" /></td>
                                            <td className="px-4 py-4"><div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" /></td>
                                            <td className="px-4 py-4 text-center"><div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-800 rounded mx-auto" /></td>
                                        </tr>
                                    ))
                                ) : filteredAuthors.length > 0 ? (
                                    filteredAuthors.map((author, index) => (
                                        <tr key={author.id} className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/30 transition-colors">
                                            <td className="px-4 py-3.5 text-center font-mono text-xs text-zinc-400">
                                                {index + 1}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <AuthorAvatar photo={author.photo} name={author.name} size="md" />
                                                    <div>
                                                        <p className="font-semibold text-zinc-900 dark:text-zinc-100">{author.name}</p>
                                                        <span className="text-[11px] text-zinc-400">ID #{author.id}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 text-zinc-600 dark:text-zinc-400 max-w-sm">
                                                {author.bio ? (
                                                    <p className="line-clamp-2 text-xs leading-relaxed">{author.bio}</p>
                                                ) : (
                                                    <span className="text-xs text-zinc-400 italic">Belum ada biografi</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3.5 text-center">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300">
                                                    {author.books ? author.books.length : 0} buku
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 text-xs text-zinc-500 whitespace-nowrap">
                                                {author.created_at
                                                    ? new Date(author.created_at).toLocaleDateString("id-ID", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    })
                                                    : "-"}
                                            </td>
                                            <td className="px-4 py-3.5 text-center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <button
                                                        onClick={() => handleOpenEditModal(author)}
                                                        title="Ubah Penulis"
                                                        className="p-1.5 text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenDeleteModal(author)}
                                                        title="Hapus Penulis"
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
                                        <td colSpan={6} className="py-12 text-center">
                                            <div className="max-w-xs mx-auto space-y-2">
                                                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                                                    {search ? "Penulis tidak ditemukan" : "Belum ada data penulis"}
                                                </p>
                                                <p className="text-xs text-zinc-500">
                                                    {search
                                                        ? `Pencarian "${search}" tidak membuahkan hasil.`
                                                        : "Klik tombol Tambah Penulis Baru untuk mendaftarkan kreator."}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* Mode Kartu Galeri (Grid) */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredAuthors.map((author) => (
                        <div
                            key={author.id}
                            className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col justify-between shadow-xs hover:border-indigo-300 dark:hover:border-zinc-700 transition group"
                        >
                            <div className="space-y-3.5">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <AuthorAvatar photo={author.photo} name={author.name} size="md" />
                                        <div>
                                            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                                                {author.name}
                                            </h4>
                                            <p className="text-[11px] text-zinc-400">
                                                {author.books ? author.books.length : 0} judul terdaftar
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                                        #{author.id}
                                    </span>
                                </div>
                                <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                                    {author.bio || "Penulis ini belum memiliki ringkasan biografi."}
                                </p>
                            </div>

                            <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                                <span className="text-[11px] text-zinc-400">
                                    {author.created_at
                                        ? new Date(author.created_at).toLocaleDateString("id-ID")
                                        : "-"}
                                </span>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => handleOpenEditModal(author)}
                                        className="px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleOpenDeleteModal(author)}
                                        className="px-2.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Create & Edit Author */}
            {isFormModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-xs">
                    <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
                            <div>
                                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                                    {modalMode === "create" ? "Tambah Penulis Baru" : "Perbarui Profil Penulis"}
                                </h3>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    {modalMode === "create"
                                        ? "Daftarkan profil penulis buku yang akan dipublikasikan."
                                        : `Memperbarui info penulis ID #${selectedAuthorId}`}
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
                            {/* Live Preview Avatar */}
                            <div className="flex items-center gap-4 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200/80 dark:border-zinc-800">
                                <AuthorAvatar photo={form.photo} name={form.name || "Nama"} size="lg" />
                                <div className="text-xs text-zinc-500">
                                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                                        {form.name || "Pratinjau Nama Penulis"}
                                    </p>
                                    <p className="text-[11px] text-zinc-400 mt-0.5">
                                        Foto profil akan muncul secara dinamis di detail buku katalog.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                                    Nama Lengkap Penulis <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="Contoh: Andrea Hirata, Tere Liye"
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
                                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                                    URL Foto Profil (Opsional)
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://images.unsplash.com/... atau tautan gambar langsung"
                                    value={form.photo}
                                    onChange={(e) => setForm((prev) => ({ ...prev, photo: e.target.value }))}
                                    className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                                />
                                {errors.photo && (
                                    <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.photo[0]}</p>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                                        Biografi Singkat
                                    </label>
                                    <span className="text-[10px] text-zinc-400 font-mono">
                                        {form.bio.length}/500
                                    </span>
                                </div>
                                <textarea
                                    rows={3}
                                    maxLength={500}
                                    placeholder="Riwayat singkat karya, penghargaan, atau latar belakang penulis..."
                                    value={form.bio}
                                    onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
                                    className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-none"
                                />
                                {errors.bio && (
                                    <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.bio[0]}</p>
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
                                        "Simpan Penulis"
                                    ) : (
                                        "Simpan Perubahan"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Hapus Author */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-xs">
                    <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-center">
                            <AuthorAvatar photo={authorToDelete?.photo} name={authorToDelete?.name} size="lg" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                                Hapus Profil Penulis
                            </h3>
                            <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
                                Apakah Anda yakin ingin menghapus penulis <strong className="text-zinc-800 dark:text-zinc-200 font-semibold">"{authorToDelete?.name}"</strong>?
                                {authorToDelete?.books && authorToDelete.books.length > 0 && (
                                    <span className="block mt-1 text-rose-500 font-medium">
                                        Perhatian: Penulis ini memiliki {authorToDelete.books.length} buku terdaftar!
                                    </span>
                                )}
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
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
            className={`${sizeClasses} rounded-full flex items-center justify-center font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 select-none tracking-tight`}
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState(null);

    // Form State
    const [form, setForm] = useState({ name: "", photo: "", bio: "" });
    const [errors, setErrors] = useState({});

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

    const handleOpenModal = () => {
        setForm({ name: "", photo: "", bio: "" });
        setErrors({});
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        if (!submitting) {
            setIsModalOpen(false);
            setErrors({});
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        if (!form.name.trim()) {
            setErrors({ name: ["Nama penulis wajib diisi."] });
            return;
        }

        try {
            setSubmitting(true);
            await authorService.create({
                name: form.name.trim(),
                photo: form.photo.trim() || null,
                bio: form.bio.trim() || null,
            });

            showToast("Data penulis berhasil ditambahkan!");
            handleCloseModal();
            fetchAuthors();
        } catch (err) {
            if (err.response?.status === 422 && err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                showToast(err.customMessage || "Gagal menambahkan author.", "error");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Toast Notification */}
            {toast && (
                <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg shadow-lg border transition-all animate-in fade-in slide-in-from-top-2 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700">
                    <span
                        className={`w-2 h-2 rounded-full ${toast.type === "success" ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                    />
                    <span>{toast.message}</span>
                </div>
            )}

            {/* Header Halaman */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                            Daftar Penulis (Authors)
                        </h1>
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                            {authors.length} penulis
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        Kelola profil kreator dan penulis buku yang terdaftar di toko.
                    </p>
                </div>

                <button
                    onClick={handleOpenModal}
                    type="button"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 active:scale-[0.99] transition-all dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 cursor-pointer shadow-sm"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Author
                </button>
            </div>

            {/* Control Bar: Search & View Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative w-full max-w-sm">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-400">
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari nama atau biografi penulis..."
                        className="w-full pl-9 pr-8 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-400 transition"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* View Switcher: Table vs Cards */}
                <div className="inline-flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 self-start sm:self-auto">
                    <button
                        onClick={() => setViewMode("table")}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${viewMode === "table"
                                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
                                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                            }`}
                    >
                        Tabel
                    </button>
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${viewMode === "grid"
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
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/75 dark:bg-zinc-800/40 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                    <th scope="col" className="w-16 px-4 py-3 text-center">No</th>
                                    <th scope="col" className="px-4 py-3">Penulis</th>
                                    <th scope="col" className="px-4 py-3">Biografi</th>
                                    <th scope="col" className="w-28 px-4 py-3 text-center">Total Buku</th>
                                    <th scope="col" className="w-36 px-4 py-3">Terdaftar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-sm">
                                {loading ? (
                                    Array.from({ length: 4 }).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-4 py-4 text-center">
                                                <div className="h-4 w-4 bg-zinc-200 dark:bg-zinc-800 rounded mx-auto" />
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                                                    <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="h-4 w-52 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <div className="h-4 w-8 bg-zinc-200 dark:bg-zinc-800 rounded mx-auto" />
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                            </td>
                                        </tr>
                                    ))
                                ) : filteredAuthors.length > 0 ? (
                                    filteredAuthors.map((author, index) => (
                                        <tr
                                            key={author.id}
                                            className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-colors"
                                        >
                                            <td className="px-4 py-3.5 text-center font-mono text-xs text-zinc-400">
                                                {index + 1}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <AuthorAvatar
                                                        photo={author.photo}
                                                        name={author.name}
                                                        size="md"
                                                    />
                                                    <div>
                                                        <p className="font-medium text-zinc-900 dark:text-zinc-100">
                                                            {author.name}
                                                        </p>
                                                        <span className="text-[11px] text-zinc-400">
                                                            ID #{author.id}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 text-zinc-600 dark:text-zinc-400 max-w-sm">
                                                {author.bio ? (
                                                    <p className="line-clamp-2 text-xs leading-relaxed">
                                                        {author.bio}
                                                    </p>
                                                ) : (
                                                    <span className="text-xs text-zinc-400 italic">
                                                        Belum ada biografi
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3.5 text-center">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
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
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center">
                                            <div className="max-w-xs mx-auto space-y-2">
                                                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                                    {search ? "Penulis tidak ditemukan" : "Belum ada data penulis"}
                                                </p>
                                                <p className="text-xs text-zinc-500">
                                                    {search
                                                        ? `Pencarian "${search}" tidak membuahkan hasil.`
                                                        : "Klik tombol Tambah Author di atas untuk mendaftarkan penulis."}
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
                /* Mode Grid Cards */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAuthors.map((author) => (
                        <div
                            key={author.id}
                            className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col justify-between space-y-3 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition"
                        >
                            <div className="flex items-start gap-3.5">
                                <AuthorAvatar
                                    photo={author.photo}
                                    name={author.name}
                                    size="md"
                                />
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                                        {author.name}
                                    </h4>
                                    <p className="text-[11px] text-zinc-400">
                                        {author.books ? author.books.length : 0} judul terdaftar
                                    </p>
                                </div>
                            </div>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                                {author.bio || "Penulis ini belum memiliki catatan biografi singkat."}
                            </p>
                            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400 flex justify-between">
                                <span>ID: #{author.id}</span>
                                <span>
                                    {author.created_at
                                        ? new Date(author.created_at).toLocaleDateString("id-ID")
                                        : "-"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Create Author */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs">
                    <div
                        className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
                        role="dialog"
                        aria-modal="true"
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
                            <div>
                                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                                    Tambah Penulis Baru
                                </h3>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    Profil penulis akan ditampilkan pada detail buku di toko.
                                </p>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                disabled={submitting}
                                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 rounded-md transition"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Live Preview Avatar */}
                            <div className="flex items-center gap-4 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
                                <AuthorAvatar
                                    photo={form.photo}
                                    name={form.name || "Nama"}
                                    size="lg"
                                />
                                <div className="text-xs text-zinc-500">
                                    <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                                        {form.name || "Nama Penulis"}
                                    </p>
                                    <p className="text-[11px] text-zinc-400">
                                        Preview tampilan avatar penulis. Masukkan URL foto di bawah untuk mengubahnya.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="author-name"
                                    className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5"
                                >
                                    Nama Lengkap Penulis <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    id="author-name"
                                    type="text"
                                    autoFocus
                                    placeholder="Contoh: Pramoedya Ananta Toer"
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm((prev) => ({ ...prev, name: e.target.value }))
                                    }
                                    className={`w-full px-3.5 py-2 text-sm bg-white dark:bg-zinc-800 border rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 transition ${errors.name
                                            ? "border-rose-400 focus:ring-rose-400/20"
                                            : "border-zinc-200 dark:border-zinc-700 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-400"
                                        }`}
                                />
                                {errors.name && (
                                    <p className="mt-1.5 text-xs text-rose-500 font-medium">
                                        {errors.name[0]}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="author-photo"
                                    className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5"
                                >
                                    URL Foto Profil (Opsional)
                                </label>
                                <input
                                    id="author-photo"
                                    type="url"
                                    placeholder="https://images.unsplash.com/... atau tautan gambar langsung"
                                    value={form.photo}
                                    onChange={(e) =>
                                        setForm((prev) => ({ ...prev, photo: e.target.value }))
                                    }
                                    className="w-full px-3.5 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-400 transition"
                                />
                                {errors.photo && (
                                    <p className="mt-1.5 text-xs text-rose-500 font-medium">
                                        {errors.photo[0]}
                                    </p>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label
                                        htmlFor="author-bio"
                                        className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
                                    >
                                        Biografi Singkat
                                    </label>
                                    <span className="text-[10px] text-zinc-400 font-mono">
                                        {form.bio.length}/500
                                    </span>
                                </div>
                                <textarea
                                    id="author-bio"
                                    rows={3}
                                    maxLength={500}
                                    placeholder="Riwayat singkat karya, penghargaan, atau latar belakang penulis..."
                                    value={form.bio}
                                    onChange={(e) =>
                                        setForm((prev) => ({ ...prev, bio: e.target.value }))
                                    }
                                    className="w-full px-3.5 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-400 transition resize-none"
                                />
                                {errors.bio && (
                                    <p className="mt-1.5 text-xs text-rose-500 font-medium">
                                        {errors.bio[0]}
                                    </p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    disabled={submitting}
                                    className="px-3.5 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-sm"
                                >
                                    {submitting ? (
                                        <>
                                            <svg
                                                className="w-3.5 h-3.5 animate-spin"
                                                viewBox="0 0 24 24"
                                                fill="none"
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
                                            Menyimpan...
                                        </>
                                    ) : (
                                        "Simpan Penulis"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
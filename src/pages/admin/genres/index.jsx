import { useEffect, useState, useMemo } from "react";
import { genreService } from "../../../_service/genreservice";

export default function AdminGenres() {
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState(null);

    // Form State
    const [form, setForm] = useState({ name: "", description: "" });
    const [errors, setErrors] = useState({});

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

    const handleOpenModal = () => {
        setForm({ name: "", description: "" });
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

        // Validasi lokal sederhana
        if (!form.name.trim()) {
            setErrors({ name: ["Nama genre wajib diisi."] });
            return;
        }

        try {
            setSubmitting(true);
            await genreService.create({
                name: form.name.trim(),
                description: form.description.trim() || null,
            });

            showToast("Genre baru berhasil ditambahkan!");
            handleCloseModal();
            fetchGenres();
        } catch (err) {
            if (err.response?.status === 422 && err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                showToast(err.customMessage || "Gagal menambahkan genre.", "error");
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
                            Daftar Genre
                        </h1>
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                            {genres.length} kategori
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        Kelola klasifikasi dan kategori buku dalam katalog penjualan.
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
                    Tambah Genre
                </button>
            </div>

            {/* Action Bar / Search */}
            <div className="flex items-center justify-between gap-3">
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
                        placeholder="Cari nama atau deskripsi genre..."
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
            </div>

            {/* Tabel Data Genre */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/75 dark:bg-zinc-800/40 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                <th scope="col" className="w-16 px-4 py-3 text-center">No</th>
                                <th scope="col" className="px-4 py-3">Nama Genre</th>
                                <th scope="col" className="px-4 py-3">Deskripsi</th>
                                <th scope="col" className="w-44 px-4 py-3">Dibuat Pada</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-sm">
                            {loading ? (
                                // Skeletons
                                Array.from({ length: 4 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-4 py-4 text-center">
                                            <div className="h-4 w-4 bg-zinc-200 dark:bg-zinc-800 rounded mx-auto" />
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="h-4 w-64 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                        </td>
                                    </tr>
                                ))
                            ) : filteredGenres.length > 0 ? (
                                filteredGenres.map((item, index) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-colors"
                                    >
                                        <td className="px-4 py-3.5 text-center font-mono text-xs text-zinc-400">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                                                    {item.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 text-zinc-600 dark:text-zinc-400 max-w-md">
                                            {item.description ? (
                                                <p className="line-clamp-2 text-xs leading-relaxed">
                                                    {item.description}
                                                </p>
                                            ) : (
                                                <span className="text-xs text-zinc-400 italic">
                                                    Tidak ada deskripsi
                                                </span>
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
                                    </tr>
                                ))
                            ) : (
                                // Empty State
                                <tr>
                                    <td colSpan={4} className="py-12 text-center">
                                        <div className="max-w-xs mx-auto space-y-2">
                                            <div className="w-10 h-10 mx-auto rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M7 7h10M7 11h7m-7 4h10M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
                                                    />
                                                </svg>
                                            </div>
                                            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                                {search ? "Genre tidak ditemukan" : "Belum ada genre"}
                                            </p>
                                            <p className="text-xs text-zinc-500">
                                                {search
                                                    ? `Tidak ada hasil yang cocok dengan kata kunci "${search}".`
                                                    : "Tambahkan genre pertama untuk mulai mengelompokkan koleksi buku."}
                                            </p>
                                            {!search && (
                                                <button
                                                    onClick={handleOpenModal}
                                                    className="mt-2 text-xs font-semibold text-zinc-900 dark:text-zinc-100 underline underline-offset-4 hover:opacity-80"
                                                >
                                                    + Tambah Genre Sekarang
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Create Genre */}
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
                                    Tambah Genre Baru
                                </h3>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    Pastikan nama genre unik dan mudah dipahami pembeli.
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
                            <div>
                                <label
                                    htmlFor="genre-name"
                                    className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5"
                                >
                                    Nama Genre <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    id="genre-name"
                                    type="text"
                                    autoFocus
                                    placeholder="Contoh: Fiksi Ilmiah, Psikologi, Novel Sejarah"
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
                                <div className="flex items-center justify-between mb-1.5">
                                    <label
                                        htmlFor="genre-desc"
                                        className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
                                    >
                                        Deskripsi
                                    </label>
                                    <span className="text-[10px] text-zinc-400 font-mono">
                                        {form.description.length}/300
                                    </span>
                                </div>
                                <textarea
                                    id="genre-desc"
                                    rows={3}
                                    maxLength={300}
                                    placeholder="Penjelasan singkat mengenai kategori genre ini..."
                                    value={form.description}
                                    onChange={(e) =>
                                        setForm((prev) => ({ ...prev, description: e.target.value }))
                                    }
                                    className="w-full px-3.5 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-400 transition resize-none"
                                />
                                {errors.description && (
                                    <p className="mt-1.5 text-xs text-rose-500 font-medium">
                                        {errors.description[0]}
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
                                        "Simpan Genre"
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
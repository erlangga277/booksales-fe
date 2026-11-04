import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../_api/axios";
import { genreService } from "../../_service/genreService";
import { authorService } from "../../_service/authorService";

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalBooks: 0,
        totalAuthors: 0,
        totalGenres: 0,
        totalTransactions: 0,
        recentBooks: [],
        recentAuthors: [],
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
    
                const [booksRes, genresRes, authorsRes, transactionsRes] = await Promise.allSettled([
                    api.get("/books"),
                    genreService.getAll(),
                    authorService.getAll(),
                    api.get("/transactions"),
                ]);
    
                const booksData = booksRes.status === "fulfilled" ? booksRes.value?.data?.data || [] : [];
                const genresData = genresRes.status === "fulfilled" ? genresRes.value?.data || [] : [];
                const authorsData = authorsRes.status === "fulfilled" ? authorsRes.value?.data || [] : [];
                const transactionsData = transactionsRes.status === "fulfilled" ? transactionsRes.value?.data?.data || [] : [];
    
                setStats({
                    totalBooks: booksData.length,
                    totalAuthors: authorsData.length,
                    totalGenres: genresData.length,
                    totalTransactions: transactionsData.length,
                    // Mengambil 5 buku terbaru
                    recentBooks: [...booksData].reverse().slice(0, 5),
                    // Mengambil 4 penulis yang paling baru ditambahkan
                    recentAuthors: [...authorsData].reverse().slice(0, 4),
                });
            } catch (err) {
                console.error("Dashboard data load error:", err);
            } finally {
                setLoading(false);
            }
        };
    
        fetchDashboardData();
    }, []);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(val || 0);
    };

    return (
        <div className="space-y-6">
            {/* Hero Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 sm:p-8 text-white shadow-xl">
                <div className="relative z-10 max-w-2xl">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md text-indigo-100 border border-white/20">
                        BookSales Admin Console
                    </span>
                    <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight">
                        Selamat Datang di Pusat Kontrol Toko Buku
                    </h1>
                    <p className="mt-2 text-xs sm:text-sm text-indigo-100 leading-relaxed">
                        Pantau inventaris buku, penulis terdaftar, kategori genre, dan riwayat transaksi toko Anda secara real-time.
                    </p>

                    {/* Quick Shortcuts */}
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <Link
                            to="/admin/books/create"
                            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-indigo-900 bg-white rounded-xl hover:bg-indigo-50 active:scale-95 transition shadow-sm"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            Tambah Buku
                        </Link>
                        <Link
                            to="/admin/authors"
                            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-xs transition"
                        >
                            Kelola Penulis
                        </Link>
                        <Link
                            to="/admin/genres"
                            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-xs transition"
                        >
                            Kelola Genre
                        </Link>
                    </div>
                </div>

                {/* Decorative background shape */}
                <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute right-20 top-0 w-32 h-32 bg-purple-400/20 rounded-full blur-xl pointer-events-none" />
            </div>

            {/* Metric Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Stat 1: Total Buku */}
                <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Total Katalog Buku</p>
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                            {loading ? "..." : stats.totalBooks}
                        </h3>
                        <Link to="/admin/books" className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mt-2 inline-block">
                            Lihat semua buku →
                        </Link>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                </div>

                {/* Stat 2: Total Penulis */}
                <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Penulis Terdaftar</p>
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                            {loading ? "..." : stats.totalAuthors}
                        </h3>
                        <Link to="/admin/authors" className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline mt-2 inline-block">
                            Lihat semua penulis →
                        </Link>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                </div>

                {/* Stat 3: Total Kategori Genre */}
                <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Kategori Genre</p>
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                            {loading ? "..." : stats.totalGenres}
                        </h3>
                        <Link to="/admin/genres" className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:underline mt-2 inline-block">
                            Kelola kategori →
                        </Link>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                    </div>
                </div>

                {/* Stat 4: Total Pesanan */}
                <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Total Transaksi</p>
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                            {loading ? "..." : stats.totalTransactions}
                        </h3>
                        <Link to="/admin/transactions" className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline mt-2 inline-block">
                            Lihat riwayat →
                        </Link>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Content Two-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Buku Terbaru dalam Sistem */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
                    <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
                        <div>
                            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                                Koleksi Buku Terbaru
                            </h3>
                            <p className="text-xs text-zinc-500">Daftar buku yang baru saja ditambahkan ke sistem.</p>
                        </div>
                        <Link
                            to="/admin/books"
                            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                            Semua Buku
                        </Link>
                    </div>

                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800 mt-2">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="py-3 flex items-center gap-3 animate-pulse">
                                    <div className="w-10 h-14 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                                    <div className="space-y-1.5 flex-1">
                                        <div className="h-4 w-40 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                        <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                    </div>
                                </div>
                            ))
                        ) : stats.recentBooks.length > 0 ? (
                            stats.recentBooks.map((book) => (
                                <div key={book.id} className="py-3.5 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        {book.cover ? (
                                            <img
                                                src={book.cover}
                                                alt={book.title}
                                                className="w-10 h-14 rounded-lg object-cover border border-zinc-200 dark:border-zinc-800"
                                            />
                                        ) : (
                                            <div className="w-10 h-14 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                                                BUKU
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                                                {book.title}
                                            </h4>
                                            <p className="text-xs text-zinc-500">
                                                Oleh: {book.author ? book.author.name : "Penulis Tidak Diketahui"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right flex-shrink-0">
                                        <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                                            {formatCurrency(book.price)}
                                        </p>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                                            Stok: {book.stock ?? 0}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-zinc-400 py-6 text-center">Belum ada koleksi buku yang ditambahkan.</p>
                        )}
                    </div>
                </div>

                {/* Right 1 Col: Penulis & Info Cepat */}
                <div className="space-y-6">
                    {/* Penulis Terbaru */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
                        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                Penulis Terdaftar
                            </h3>
                            <Link to="/admin/authors" className="text-xs text-indigo-600 font-semibold hover:underline">
                                Kelola
                            </Link>
                        </div>
                        <div className="divide-y divide-zinc-100 dark:divide-zinc-800 mt-2">
                            {stats.recentAuthors.length > 0 ? (
                                stats.recentAuthors.map((author) => (
                                    <div key={author.id} className="py-2.5 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 font-bold text-xs flex items-center justify-center">
                                            {author.name ? author.name.slice(0, 2).toUpperCase() : "AU"}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                                                {author.name}
                                            </p>
                                            <p className="text-[10px] text-zinc-400">
                                                {author.books ? author.books.length : 0} buku terdaftar
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-zinc-400 py-4 text-center">Belum ada data penulis.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
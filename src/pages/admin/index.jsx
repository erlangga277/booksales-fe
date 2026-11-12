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
    totalOmset: 0,
    recentBooks: [],
    recentTransactions: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [booksRes, genresRes, authorsRes, transactionsRes] =
          await Promise.allSettled([
            api.get("/books"),
            genreService.getAll(),
            authorService.getAll(),
            api.get("/transactions"),
          ]);

        const booksData =
          booksRes.status === "fulfilled"
            ? booksRes.value?.data?.data || booksRes.value?.data || []
            : [];
        const genresData =
          genresRes.status === "fulfilled"
            ? genresRes.value?.data || []
            : [];
        const authorsData =
          authorsRes.status === "fulfilled"
            ? authorsRes.value?.data || []
            : [];
        const transactionsData =
          transactionsRes.status === "fulfilled"
            ? transactionsRes.value?.data?.data || []
            : [];

        const omset = transactionsData.reduce(
          (acc, cur) => acc + Number(cur.total_amount || 0),
          0
        );

        setStats({
          totalBooks: booksData.length,
          totalAuthors: authorsData.length,
          totalGenres: genresData.length,
          totalTransactions: transactionsData.length,
          totalOmset: omset,
          recentBooks: [...booksData].reverse().slice(0, 5),
          recentTransactions: [...transactionsData].reverse().slice(0, 5),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const metricCards = [
    {
      title: "Total Judul Buku",
      value: stats.totalBooks,
      sub: "Judul dalam katalog",
      to: "/admin/books",
    },
    {
      title: "Penulis Terdaftar",
      value: stats.totalAuthors,
      sub: "Penulis aktif",
      to: "/admin/authors",
    },
    {
      title: "Kategori / Genre",
      value: stats.totalGenres,
      sub: "Kategori buku",
      to: "/admin/genres",
    },
    {
      title: "Total Transaksi",
      value: stats.totalTransactions,
      sub: `Rp ${stats.totalOmset.toLocaleString("id-ID")} omzet`,
      to: "/admin/transactions",
    },
  ];

  return (
    <div className="p-6 bg-zinc-50 dark:bg-zinc-950 min-h-screen space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Dashboard Toko
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Kondisi katalog buku dan data transaksi saat ini
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card, idx) => (
          <Link
            key={idx}
            to={card.to}
            className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition"
          >
            <div className="text-xs font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
              {card.title}
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">
              {loading ? "..." : card.value}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              {card.sub}
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Pesanan Terbaru
            </h2>
            <Link
              to="/admin/transactions"
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Lihat semua
            </Link>
          </div>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {stats.recentTransactions.length === 0 ? (
              <p className="text-sm text-zinc-400 py-4 text-center">
                Belum ada pesanan terbaru.
              </p>
            ) : (
              stats.recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="py-3 flex items-center justify-between text-sm"
                >
                  <div>
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">
                      {tx.customer?.name || "Customer #" + tx.customer_id}
                    </div>
                    <div className="text-xs text-zinc-500 font-mono">
                      {tx.order_number}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                      Rp {Number(tx.total_amount).toLocaleString("id-ID")}
                    </div>
                    <div className="text-xs text-zinc-500">
                      {new Date(tx.created_at).toLocaleDateString("id-ID")}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Buku Terbaru
            </h2>
            <Link
              to="/admin/books"
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Lihat semua
            </Link>
          </div>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {stats.recentBooks.length === 0 ? (
              <p className="text-sm text-zinc-400 py-4 text-center">
                Belum ada buku ditambahkan.
              </p>
            ) : (
              stats.recentBooks.map((b) => (
                <div
                  key={b.id}
                  className="py-3 flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-3">
                    {b.cover_photo ? (
                      <img
                        src={b.cover_photo}
                        alt=""
                        className="w-8 h-10 object-cover rounded"
                      />
                    ) : (
                      <div className="w-8 h-10 bg-zinc-200 dark:bg-zinc-800 rounded flex items-center justify-center text-[10px] text-zinc-500">
                        No Img
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-zinc-900 dark:text-zinc-100">
                        {b.title}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {b.author?.name || "-"}
                      </div>
                    </div>
                  </div>
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Rp {Number(b.price).toLocaleString("id-ID")}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

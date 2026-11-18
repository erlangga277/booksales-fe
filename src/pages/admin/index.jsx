import { useEffect, useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../../_api/axios";
import { genreService } from "../../_service/genreService";
import { authorService } from "../../_service/authorService";
import { getImageUrl } from "../../_utils/image";

function RevenueChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-sm text-zinc-400">
        Belum ada data transaksi lunas untuk ditampilkan.
      </div>
    );
  }

  const padding = { top: 20, right: 20, bottom: 30, left: 20 };
  const width = 600;
  const height = 200;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxVal = Math.max(...data.map((d) => d.total), 1);
  const minVal = 0;

  const points = data.map((d, index) => {
    const x = padding.left + (index / Math.max(data.length - 1, 1)) * chartWidth;
    const y = padding.top + chartHeight - ((d.total - minVal) / (maxVal - minVal)) * chartHeight;
    return { ...d, x, y };
  });

  const pathD = points.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ""
  );

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`
    : "";

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-48 overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        <line
          x1={padding.left}
          y1={padding.top}
          x2={width - padding.right}
          y2={padding.top}
          stroke="currentColor"
          className="text-zinc-200 dark:text-zinc-800"
          strokeDasharray="4 4"
        />
        <line
          x1={padding.left}
          y1={padding.top + chartHeight / 2}
          x2={width - padding.right}
          y2={padding.top + chartHeight / 2}
          stroke="currentColor"
          className="text-zinc-200 dark:text-zinc-800"
          strokeDasharray="4 4"
        />
        <line
          x1={padding.left}
          y1={padding.top + chartHeight}
          x2={width - padding.right}
          y2={padding.top + chartHeight}
          stroke="currentColor"
          className="text-zinc-200 dark:text-zinc-800"
        />

        {areaD && <path d={areaD} fill="url(#revenueGradient)" />}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke="#4f46e5"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {points.map((p, i) => (
          <g key={i} className="group">
            <circle
              cx={p.x}
              cy={p.y}
              r="4"
              className="fill-indigo-600 dark:fill-indigo-400 stroke-white dark:stroke-zinc-900 stroke-2"
            />
          </g>
        ))}
      </svg>

      <div className="flex justify-between items-center text-[11px] text-zinc-400 dark:text-zinc-500 mt-2 px-1">
        {data.map((d, i) => (
          <span key={i} className="truncate max-w-[60px] text-center">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalAuthors: 0,
    totalGenres: 0,
    totalTransactions: 0,
    totalOmset: 0,
    allTransactions: [],
    recentBooks: [],
    recentTransactions: [],
  });

  const isMountedRef = useRef(true);

  const fetchDashboardData = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);

      const [booksRes, genresRes, authorsRes, transactionsRes] =
        await Promise.allSettled([
          api.get("/books"),
          genreService.getAll(),
          authorService.getAll(),
          api.get("/transactions"),
        ]);

      if (!isMountedRef.current) return;

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

      // Gateway returns settlement for confirmed Midtrans captures.
      const paidTransactions = transactionsData.filter(
        (tx) => tx.status === "paid" || tx.status === "settlement"
      );

      const omset = paidTransactions.reduce(
        (acc, cur) => acc + Number(cur.total_amount || 0),
        0
      );

      setStats({
        totalBooks: booksData.length,
        totalAuthors: authorsData.length,
        totalGenres: genresData.length,
        totalTransactions: transactionsData.length,
        totalOmset: omset,
        allTransactions: transactionsData,
        recentBooks: [...booksData].reverse().slice(0, 5),
        recentTransactions: [...transactionsData].reverse().slice(0, 5),
      });
      setLastUpdated(new Date());
    } finally {
      if (isMountedRef.current && isInitial) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    fetchDashboardData(true);

    const intervalId = setInterval(() => {
      fetchDashboardData(false);
    }, 15000);

    return () => {
      isMountedRef.current = false;
      clearInterval(intervalId);
    };
  }, []);

  const chartData = useMemo(() => {
    const paidTxs = stats.allTransactions.filter(
      (tx) => tx.status === "paid" || tx.status === "settlement"
    );

    if (paidTxs.length === 0) return [];

    const groupedByDate = paidTxs.reduce((acc, tx) => {
      const dateObj = tx.created_at ? new Date(tx.created_at) : null;
      const sortKey = dateObj && !isNaN(dateObj)
        ? dateObj.toISOString().slice(0, 10)
        : "0000-00-00";

      const displayLabel = dateObj && !isNaN(dateObj)
        ? dateObj.toLocaleDateString("id-ID", { day: "2-digit", month: "short" })
        : "N/A";

      if (!acc[sortKey]) {
        acc[sortKey] = { label: displayLabel, total: 0 };
      }
      acc[sortKey].total += Number(tx.total_amount || 0);
      return acc;
    }, {});

    return Object.keys(groupedByDate)
      .sort()
      .slice(-7)
      .map((key) => groupedByDate[key]);
  }, [stats.allTransactions]);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Dashboard Toko
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Kondisi katalog buku dan data transaksi saat ini
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-zinc-500 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Live · {lastUpdated.toLocaleTimeString("id-ID")}</span>
        </div>
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

      <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Tren Omset Penjualan
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Akumulasi pemasukan transaksi lunas terbaru
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-wider text-zinc-400">Total Omset</div>
            <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
              Rp {stats.totalOmset.toLocaleString("id-ID")}
            </div>
          </div>
        </div>

        <RevenueChart data={chartData} />
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
                        src={getImageUrl(b.cover_photo)}
                        alt=""
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&q=80";
                        }}
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

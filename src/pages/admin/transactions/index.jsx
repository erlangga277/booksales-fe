import { useEffect, useState } from "react";
import { transactionService } from "../../../_service/transactionService";

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await transactionService.getAll();
      setTransactions(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id, orderNo) => {
    if (!window.confirm(`Hapus catatan transaksi ${orderNo}?`)) return;
    try {
      await transactionService.delete(id);
      setTransactions((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert("Gagal menghapus transaksi.");
    }
  };

  const filtered = transactions.filter((tx) => {
    const q = search.toLowerCase();
    return (
      (tx.customer?.name || "").toLowerCase().includes(q) ||
      (tx.customer?.email || "").toLowerCase().includes(q) ||
      (tx.book?.title || "").toLowerCase().includes(q) ||
      (tx.order_number || "").toLowerCase().includes(q)
    );
  });

  const totalOmset = transactions.reduce(
    (acc, cur) => acc + Number(cur.total_amount || 0),
    0
  );

  return (
    <div className="p-6 bg-zinc-50 dark:bg-zinc-950 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Pesanan Buku Masuk
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Total {transactions.length} pesanan | Akumulasi: Rp{" "}
            {totalOmset.toLocaleString("id-ID")}
          </p>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari user, buku, nomor order..."
          className="w-full sm:w-72 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm rounded-lg px-3.5 py-2"
        />
      </div>

      <div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-zinc-600 dark:text-zinc-400">
            <thead className="text-xs uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-3.5">No. Order</th>
                <th className="px-6 py-3.5">Pelanggan</th>
                <th className="px-6 py-3.5">Buku</th>
                <th className="px-6 py-3.5">Penulis & Genre</th>
                <th className="px-6 py-3.5">Total Bayar</th>
                <th className="px-6 py-3.5">Waktu</th>
                <th className="px-6 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-zinc-400">
                    Memuat data transaksi...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-zinc-400">
                    Tidak ada transaksi ditemukan.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition"
                  >
                    <td className="px-6 py-4 font-mono font-semibold text-xs text-indigo-600 dark:text-indigo-400">
                      {tx.order_number}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-900 dark:text-zinc-100">
                        {tx.customer?.name || "Customer #" + tx.customer_id}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {tx.customer?.email || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {tx.book?.cover_photo && (
                          <img
                            src={tx.book.cover_photo}
                            alt=""
                            className="w-8 h-10 object-cover rounded shadow-sm flex-shrink-0"
                          />
                        )}
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                          {tx.book?.title || `Buku ID #${tx.book_id}`}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-zinc-900 dark:text-zinc-100">
                        {tx.book?.author?.name || "-"}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {tx.book?.genre?.name || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100">
                      Rp {Number(tx.total_amount).toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-xs text-zinc-500">
                      {tx.created_at
                        ? new Date(tx.created_at).toLocaleString("id-ID", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(tx.id, tx.order_number)}
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
    </div>
  );
}

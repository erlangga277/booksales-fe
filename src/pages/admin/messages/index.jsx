import { useEffect, useState } from "react";
import { messageService } from "../../../_service/messageService";

function formatWhatsAppUrl(phone, name, subject) {
  let normalized = (phone || "").replace(/\D/g, "");
  if (normalized.startsWith("0")) normalized = "62" + normalized.slice(1);
  if (!normalized.startsWith("62")) normalized = "62" + normalized;
  const text = `Halo ${name}, kami dari tim BookSales.\n\nMenanggapi pertanyaan Anda perihal "${subject}": `;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(text)}`;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await messageService.getAll();
      setMessages(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id, subject) => {
    if (!window.confirm(`Hapus pesan "${subject}"?`)) return;
    try {
      await messageService.delete(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch {
      alert("Gagal menghapus pesan.");
    }
  };

  const filtered = messages.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.phone?.toLowerCase().includes(q) ||
      m.subject?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 bg-zinc-50 dark:bg-zinc-950 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Pesan Masuk (Kontak Pengguna)
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Total {messages.length} pesan masuk via WhatsApp
          </p>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari pengirim, email, WhatsApp, subjek..."
          className="w-full sm:w-72 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm rounded-lg px-3.5 py-2"
        />
      </div>

      <div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-zinc-600 dark:text-zinc-400">
            <thead className="text-xs uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-3.5">Nama & Email</th>
                <th className="px-6 py-3.5">No. WhatsApp</th>
                <th className="px-6 py-3.5">Subjek</th>
                <th className="px-6 py-3.5">Pesan</th>
                <th className="px-6 py-3.5">Waktu</th>
                <th className="px-6 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-zinc-400">
                    Memuat pesan masuk...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-zinc-400">
                    Tidak ada pesan masuk.
                  </td>
                </tr>
              ) : (
                filtered.map((msg) => (
                  <tr
                    key={msg.id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-900 dark:text-zinc-100">
                        {msg.name}
                      </div>
                      <div className="text-xs text-zinc-500">{msg.email || "—"}</div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-zinc-700 dark:text-zinc-300">
                      {msg.phone || "—"}
                    </td>
                    <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100">
                      {msg.subject}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 max-w-sm">
                        {msg.message}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-xs text-zinc-500">
                      {new Date(msg.created_at).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <a
                        href={formatWhatsAppUrl(msg.phone, msg.name, msg.subject)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        Balas WA
                      </a>
                      <button
                        onClick={() => handleDelete(msg.id, msg.subject)}
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

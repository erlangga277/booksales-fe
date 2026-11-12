import { useEffect, useState } from "react";
import { userService } from "../../../_service/userService";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userService.getAll();
      setUsers(Array.isArray(res) ? res : res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (user, newRole) => {
    if (user.role === newRole) return;
    if (!window.confirm(`Ubah hak akses "${user.name}" menjadi "${newRole}"?`)) return;

    setUpdatingId(user.id);
    try {
      await userService.updateRole(user.id, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      alert(err.customMessage || "Gagal mengubah role pengguna.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const q = search.toLowerCase();
    return (
      matchesRole &&
      (u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q))
    );
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="p-6 bg-zinc-50 dark:bg-zinc-950 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Daftar Pengguna
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Total {users.length} akun terdaftar di sistem
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm rounded-lg px-3 py-2"
          >
            <option value="all">Semua Role</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau email..."
            className="w-full sm:w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm rounded-lg px-3.5 py-2"
          />
        </div>
      </div>

      <div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-zinc-600 dark:text-zinc-400">
            <thead className="text-xs uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-3.5">Pengguna</th>
                <th className="px-6 py-3.5">Status Verifikasi</th>
                <th className="px-6 py-3.5">Total Pesanan</th>
                <th className="px-6 py-3.5">Akses Terakhir</th>
                <th className="px-6 py-3.5 text-right">Hak Akses</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-zinc-400">
                    Memuat data pengguna...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-zinc-400">
                    Tidak ada akun ditemukan.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-900 dark:text-zinc-100">
                        {user.name}
                      </div>
                      <div className="text-xs text-zinc-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      {user.email_verified_at ? (
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          Terverifikasi
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-400">
                          Belum Verifikasi
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100">
                      {user.transactions_count ?? 0} transaksi
                    </td>
                    <td className="px-6 py-4 text-xs text-zinc-500">
                      {formatDate(user.last_access)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select
                        disabled={updatingId === user.id}
                        value={user.role}
                        onChange={(e) => handleRoleChange(user, e.target.value)}
                        className={`text-xs font-semibold rounded-lg px-2.5 py-1 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 cursor-pointer ${
                          user.role === "admin"
                            ? "text-purple-600 dark:text-purple-400"
                            : "text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                      </select>
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

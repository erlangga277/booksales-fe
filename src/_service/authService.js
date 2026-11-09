import api from "../_api/axios";

export const authService = {
  // 1. Register: Menerima name, email, password, dan role ('customer' | 'admin')
  register: async (payload) => {
    const res = await api.post("/register", payload);
    return res.data;
  },

  // 2. Login: Mengirim email & password, mengembalikan token dan role
  login: async (payload) => {
    const res = await api.post("/login", payload);
    const data = res.data;

    // Simpan token dan role ke localStorage
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    if (data.role) {
      localStorage.setItem("role", data.role);
    }

    return data;
  },

  // 3. Logout: Menghapus token di server dan di browser
  logout: async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.warn("Logout error di server, tetap bersihkan session lokal:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    }
  },

  // Helper auth utilities
  getToken: () => localStorage.getItem("token"),
  getRole: () => localStorage.getItem("role"),
  isAuthenticated: () => !!localStorage.getItem("token"),
  isAdmin: () => localStorage.getItem("role") === "admin",
  isCustomer: () => localStorage.getItem("role") === "customer",
};

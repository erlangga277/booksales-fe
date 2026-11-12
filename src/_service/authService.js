import api from "../_api/axios";

export const authService = {
  register: async (payload) => {
    const res = await api.post("/register", payload);
    return res.data;
  },

  login: async (payload) => {
    const res = await api.post("/login", payload);
    const data = res.data;

    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    if (data.role) {
      localStorage.setItem("role", data.role);
    }
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return data;
  },

  logout: async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.warn("Logout error di server, tetap bersihkan session lokal:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
    }
  },

  getToken: () => localStorage.getItem("token"),
  getRole: () => localStorage.getItem("role"),
  getUser: () => {
    const user = localStorage.getItem("user");
    try {
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },
  isAuthenticated: () => !!localStorage.getItem("token"),
  isAdmin: () => localStorage.getItem("role") === "admin",
  isCustomer: () => {
    const role = localStorage.getItem("role");
    return role === "customer" || role === "user";
  },
};

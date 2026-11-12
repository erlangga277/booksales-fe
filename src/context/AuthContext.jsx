import { createContext, useContext, useState } from "react";
import { authService } from "../_service/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => authService.getToken());
  const [role, setRole] = useState(() => authService.getRole());
  const [user, setUser] = useState(() => authService.getUser());
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await authService.login(credentials);
      setToken(data.token);
      setRole(data.role);
      setUser(data.user || null);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setToken(null);
      setRole(null);
      setUser(null);
    }
  };

  const value = {
    token,
    role,
    user,
    loading,
    isAuthenticated: !!token,
    isAdmin: role === "admin",
    isCustomer: role === "customer" || role === "user",
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

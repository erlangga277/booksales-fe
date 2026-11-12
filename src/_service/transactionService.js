import api from "../_api/axios";

export const transactionService = {
  getAll: async () => {
    const res = await api.get("/transactions");
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/transactions/${id}`);
    return res.data;
  },
  create: async (payload) => {
    const res = await api.post("/transactions", payload);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/transactions/${id}`);
    return res.data;
  },
};

import api from "../_api/axios";

export const authorService = {
  getAll: async () => {
    const res = await api.get("/authors");
    return res.data;
  },
  create: async (payload) => {
    const res = await api.post("/authors", payload);
    return res.data;
  },
};
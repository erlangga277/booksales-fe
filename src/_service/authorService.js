import api from "../_api/axios";

export const authorService = {
  getAll: async () => {
    const res = await api.get("/authors");
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/authors/${id}`);
    return res.data;
  },
  create: async (payload) => {
    const res = await api.post("/authors", payload);
    return res.data;
  },
  update: async (id, payload) => {
    const res = await api.put(`/authors/${id}`, payload);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/authors/${id}`);
    return res.data;
  },
};
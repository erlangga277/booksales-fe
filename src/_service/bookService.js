import api from "../_api/axios";

export const bookService = {
  getAll: async () => {
    const res = await api.get("/books");
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/books/${id}`);
    return res.data;
  },
  create: async (payload) => {
    const isFormData = payload instanceof FormData;
    const res = await api.post("/books", payload, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
    });
    return res.data;
  },
  update: async (id, payload) => {
    const res = await api.put(`/books/${id}`, payload);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/books/${id}`);
    return res.data;
  },
};

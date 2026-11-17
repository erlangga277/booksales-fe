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
    const isFormData = payload instanceof FormData;
    const res = await api.post("/authors", payload, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
    });
    return res.data;
  },
  update: async (id, payload) => {
    const isFormData = payload instanceof FormData;
    const res = await api.post(`/authors/${id}`, payload, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
      params: { _method: "PUT" },
    });
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/authors/${id}`);
    return res.data;
  },
};

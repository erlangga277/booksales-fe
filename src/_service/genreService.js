import api from "../_api/axios";

export const genreService = {
  getAll: async () => {
    const res = await api.get("/genres");
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/genres/${id}`);
    return res.data;
  },
  create: async (payload) => {
    const res = await api.post("/genres", payload);
    return res.data;
  },
  update: async (id, payload) => {
    const res = await api.put(`/genres/${id}`, payload);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/genres/${id}`);
    return res.data;
  },
};
import api from "../_api/axios";

export const genreService = {
  getAll: async () => {
    const res = await api.get("/genres");
    return res.data;
  },
  create: async (payload) => {
    const res = await api.post("/genres", payload);
    return res.data;
  },
};
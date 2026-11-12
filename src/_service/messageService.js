import api from "../_api/axios";

export const messageService = {
  send: async (payload) => {
    const res = await api.post("/contact", payload);
    return res.data;
  },
  getAll: async () => {
    const res = await api.get("/messages");
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/messages/${id}`);
    return res.data;
  },
};

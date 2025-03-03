import api from "./apiService";

export default {
  async post(endpoint, payload) {
    return await api.post(endpoint, payload);
  },

  async get(endpoint) {
    return await api.get(endpoint);
  },
};
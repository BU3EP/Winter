import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    user: null,
    token: localStorage.getItem("token") || "",
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setToken(state, token) {
      state.token = token;
      localStorage.setItem("token", token);
    },
    logout(state) {
      state.user = null;
      state.token = "";
      localStorage.removeItem("token");
    }
  },
  actions: {
    async fetchSession({ commit }) {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/session", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        commit("setUser", response.data.user);
      } catch (error) {
        console.error("Session expired or invalid token.");
        commit("logout");
      }
    }
  }
});

import axios from "axios";

export default {
  state: {
    data: [],
    isLoading: false
  },
  mutations: {
    SET_EVENT_DATA(state, data) {
      state.data = data.data;
      state.isLoading = false;
    },
    EMPTY_EVENT_DATA(state) {
      state.data = [];
      state.isLoading = true;
    },
    SET_LOADING(state, payload) {
      state.isLoading = payload;
    }
  },
  actions: {
    getEventData({ commit }) {
      commit("EMPTY_EVENT_DATA");
      commit("SET_LOADING", true);
      axios
        .get("/json/event.json", {})
        .then(response => {
          // Simulate server delay
          setTimeout(function() {
            if (response.data) {
              commit("SET_EVENT_DATA", response.data);
            }
            commit("SET_LOADING", false);
          }, 1500);
        })
        .catch(error => {
          // Error handling
          console.log("Check for auth permission /n" + error.response);
        });
    }
  }
};

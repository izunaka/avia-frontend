import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    api: "https://localhost:44347/api/"
  },
  getters: {
    getApi(state) {
      return state.api;
    },
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})

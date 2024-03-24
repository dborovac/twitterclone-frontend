import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    profile: {}
  },
  mutations: {
    setProfile(state, profile) {
      state.profile = profile;
    }
  },
  actions: {
    updateProfile({ commit }, profile) {
      commit('setProfile', profile);
    }
  },
  getters: {
    getProfile: state => {
      return state.profile;
    }
  },
});

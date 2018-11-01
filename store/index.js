import Vuex from "vuex";

const createStore = () => {
  return new Vuex.Store({
    state: {
      poem: [],
      hero: {}
    },
    mutations: {
      addPoem(state, payload) {
        state.poem = payload;
      },
      updateHero(state, payload) {
        state.hero = payload;
      }
    }
  });
};

export default createStore;

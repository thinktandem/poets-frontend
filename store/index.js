import Vuex from "vuex";

const createStore = () => {
  return new Vuex.Store({
    state: {
      poem: [],
      hero: {},
      numPages: {
        numPages: 0
      }
    },
    mutations: {
      addPoem(state, payload) {
        state.poem = payload;
      },
      updateHero(state, payload) {
        state.hero = payload;
      },
      updateNumPages(state, payload) {
        state.numPages = payload;
      }
    }
  });
};

export default createStore;

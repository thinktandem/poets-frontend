import Vuex from 'vuex';

const createStore = () => {
  return new Vuex.Store({
    state: {
      poems: [] 
    },
    mutations: {
      addPoem (state, payload) {
        state.poem = payload;
      }
    }
  })
}

export default createStore;

import Vuex from 'vuex';

const createStore = () => {
  return new Vuex.Store({
    state: {
      poems: [] 
    },
    mutations: {
      add (state, payload) {
        state.poems = payload;
      }
    }
  })
}

export default createStore;

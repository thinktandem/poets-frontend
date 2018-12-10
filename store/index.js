import Vuex from "vuex";

const createStore = () => {
  return new Vuex.Store({
    state: {
      poemOfTheDay: {
        poet: {
          name: "Gabrielle Calvocoressi",
          image: "/images/gc.png"
        },
        poem: {
          link: "https://appUrl/announcementId",
          title: "Awesome Poem Title",
          text: "Awesome Poem"
        }
      },
      poem: [],
      hero: {},
      numPages: {
        numPages: 0
      },
      filterOptions: {
        options: []
      },
      states: {}
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
      },
      updatePoemOfTheDay(state, payload) {
        state.poemOfTheDay = payload;
      },
      updateFilterOptions(state, payload) {
        state.filterOptions = payload;
      },
      updateStates(state, payload) {
        state.states = payload;
      }
    }
  });
};

export default createStore;

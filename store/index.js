import Vuex from "vuex";

const createStore = () => {
  return new Vuex.Store({
    state: {
      poemOfTheDay: {
        poet: {
          name: "Gabrielle Calvocoressi",
          alias: "/poets",
          image: "/images/gc.png"
        },
        poem: {
          alias: "/poems",
          title: "Awesome Poem Title",
          text: "Awesome Poem",
          soundCloud: ""
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
      states: {},
      productFeature: {},
      pageData: {},
      sidebarData: {}
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
      },
      updateProductFeature(state, payload) {
        state.productFeature = payload;
      },
      updatePageData(state, payload) {
        state.pageData = payload;
      },
      updateSidebarData(state, payload) {
        state.sidebarData = payload;
      }
    }
  });
};

export default createStore;

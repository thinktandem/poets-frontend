import Vuex from "vuex";

const createStore = () => {
  return new Vuex.Store({
    state: {
      announcements: [],
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
      authors: {},
      occasions: {},
      themes: {},
      form: {},
      productFeature: {},
      pageData: {},
      sidebarData: {},
      highlightedData: {},
      extendedContent: {},
      bottomContent: {},
      featuredPoems: {},
      featuredPoets: {
        link: ""
      },
      featuredContent: {},
      subNavigation: null,
      topMenu: [],
      midMenu: [],
      subMenu: [],
      showSubMenu: true,
      metatags: []
    },
    mutations: {
      updateBottomContent(state, payload) {
        state.bottomContent = payload;
      },
      updateRelatedContent(state, payload) {
        state.relatedContent = payload;
      },
      addPoem(state, payload) {
        state.poem = payload;
      },
      updateAnnouncements(state, payload) {
        state.announcements = payload;
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
      updateAuthors(state, payload) {
        state.authors = payload;
      },
      updateOccasions(state, payload) {
        state.occasions = payload;
      },
      updateThemes(state, payload) {
        state.themes = payload;
      },
      updateForm(state, payload) {
        state.form = payload;
      },
      updateProductFeature(state, payload) {
        state.productFeature = payload;
      },
      updatePageData(state, payload) {
        state.pageData = payload;
      },
      updatePostData(state, payload) {
        state.postData = payload;
      },
      updateSidebarData(state, payload) {
        state.sidebarData = payload;
      },
      updateHighlightedData(state, payload) {
        state.highlightedData = payload;
      },
      updateExtendedContent(state, payload) {
        state.extendedContent = payload;
      },
      updateFeaturedPoems(state, payload) {
        state.featuredPoems = payload;
      },
      updateFeaturedContent(state, payload) {
        state.featuredContent = payload;
      },
      updateFeaturedPoets(state, payload) {
        state.featuredPoets = payload;
      },
      updateSubNavigation(state, payload) {
        state.subNavigation = payload;
      },
      updateTopMenu(state, payload) {
        state.topMenu = payload;
      },
      updateMidMenu(state, payload) {
        state.midMenu = payload;
      },
      updateSubMenu(state, payload) {
        state.subMenu = payload;
      },
      toggleSubMenu(state, payload) {
        state.showSubMenu = payload;
      },
      updateMetatags(state, payload) {
        state.metatags = payload;
      }
    }
  });
};

export default createStore;

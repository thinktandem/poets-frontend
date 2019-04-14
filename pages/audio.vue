<template>
  <div>
    <basic-page
      :page-data="$store.state.pageData"
      :highlighted="$store.state.highlightedData"
      :more="$store.state.relatedContent"
      :extended-content="$store.state.extendedContent"
      :sidebar-data="$store.state.sidebarData"/>
    <card-deck
      cardtype="PoemCard"
      :cards="featuredAudio"/>
    <b-container class="poems-list tabular-list">
      <b-row class="tabular-list__row tabular-list__header">
        <b-col md="3">
          Year
        </b-col>
        <b-col md="6">
          Title
        </b-col>
        <b-col md="3">
          Author
        </b-col>
      </b-row>
      <b-row
        v-for="audio in audios"
        class="tabular-list__row poems-list__poems"
        :key="audio.id">
        <b-col md="3">
          {{ audio.field_date_published }}
        </b-col>
        <b-col md="6">
          <b-link
            class="poem__link"
            :to="audio.view_node"
            v-html="audio.title"/>
        </b-col>
        <b-col
          v-html="audio.field_author"
          md="2"/>
      </b-row>

      <div class="pager">
        <b-pagination
          @input="paginate"
          :disabled="busy"
          aria-controls="texts"
          class="pagination"
          hide-goto-end-buttons
          :per-page="perPage"
          size="lg"
          :total-rows="rows"
          v-model="page"
          align="fill">
          <span slot="prev-text">
            <iconMediaSkipBackwards /> Prev
          </span>
          <span slot="next-text">
            Next <iconMediaSkipForwards />
          </span>
        </b-pagination>
      </div>
    </b-container>
  </div>
</template>

<script>
import _ from "lodash";
import qs from "qs";
import BasicPage from "~/components/BasicPage";
import CardDeck from "~/components/CardDeck";
import iconMediaSkipBackwards from "~/static/icons/media-skip-backwards.svg";
import iconMediaSkipForwards from "~/static/icons/media-skip-forwards.svg";
import MagnifyingGlassIcon from "~/node_modules/open-iconic/svg/magnifying-glass.svg";
import MetaTags from "~/plugins/metatags";

// Helper to build out query
const buildQuery = (filters = {}) =>
  _.pickBy({
    combine: filters.combine
  });

export default {
  components: {
    BasicPage,
    CardDeck,
    iconMediaSkipBackwards,
    iconMediaSkipForwards,
    MagnifyingGlassIcon
  },
  head() {
    return MetaTags.renderTags(this.$store.state.metatags);
  },
  data() {
    return {
      audios: [],
      busy: true,
      filters: {
        combine: null,
        type: null
      },
      options: {
        types: []
      },
      page: 1,
      pageCache: [],
      perPage: 20,
      rows: 0
    };
  },
  mounted() {
    // Get all the data we need for search
    Promise.all([this.searchAudio()]);
    // Spin up a debouncing func for text input
    this.debouncedSearchAudio = _.debounce(this.searchAudio, 700);
  },
  methods: {
    searchAudio(page = 0) {
      this.busy = true;
      const query = _.merge({}, buildQuery(this.filters), { page });
      this.$api.searchAudio({ query }).then(response => {
        console.log(response);
        this.audios = _.get(response, "data.rows", []);
        this.page = _.get(response, "data.pager.current_page", 1) + 1;
        this.rows = _.get(response, "data.pager.total_items", 0);
        this.busy = false;
      });
    },
    paginate() {
      this.busy = true;
      // @NOTE: drupal starts at page 0, bPagination starts at 1
      // https://en.wikipedia.org/wiki/Off-by-one_error
      const queryPage = this.page - 1;
      this.searchAudio(queryPage);
    }
  },
  watch: {
    "filters.combine": function() {
      this.debouncedSearchBooks();
    }
  },
  async asyncData({ app, params, query }) {
    const featureParams = qs.stringify({
      filter: {
        soundcloud: {
          path: "field_soundcloud_embed_code",
          operator: "<>",
          value: ""
        },
        field_featured: 1
      },
      page: {
        limit: 3
      },
      include: "field_author"
    });
    const featured = await app.$axios.$get(`/api/node/poems?${featureParams}`);
    return {
      featuredAudio: _.map(featured.data, poem => ({
        title: _.get(poem, "attributes.title"),
        text:
          _.get(poem, "attributes.body.summary") ||
          _.get(poem, "attributes.body.processed"),
        poet: {
          name: _.get(
            _.find(
              featured.included,
              include =>
                _.get(include, "id") ===
                _.get(
                  _.first(_.get(poem, "relationships.field_author.data")),
                  "id"
                )
            ),
            "attributes.title"
          )
        },
        year: _.get(poem, "attributes.field_date_published").split("-")[0],
        link: _.get(poem, "attributes.path.alias")
      }))
    };
  },
  async fetch({ app, store, route }) {
    return app.$buildBasicPage(app, store, route.path);
  }
};
</script>

<style scoped lang="scss">
.poems-list__poems {
  font-weight: 400;
  a {
    color: $body-color;

    &:hover,
    &:focus,
    &:active {
      text-decoration: underline;
    }
  }
}
.tabular-list__header {
  background-color: #f2f8fa;
  text-transform: uppercase;
  font-weight: 560;
}
.poems-list {
  padding-top: 3rem;
  padding-bottom: 3rem;
}
.poems-list__search {
  margin-top: 2rem;
}
.poem__link {
  font-weight: 560;
}
.legend-selects {
  display: flex;
  flex-basis: 100%;
  padding: 1rem 1rem 1rem 2rem;
  border-right: $form__border;

  select {
    &:not(:last-child) {
      margin-right: 1rem;
    }
  }
}

.poems-list__filters__legend {
  flex-basis: 50%;

  legend {
    margin: 0;
    line-height: 2;
    font-size: $font-size-base;
    color: $gray-700;
  }
}

.poems-list__input--search {
  flex-basis: 100%;
  padding: 1rem;
  position: relative;

  input {
    border: none;
    background-color: transparent;

    &:hover,
    &:focus,
    &:active {
      border: none;
      background-color: transparent;
    }

    &::placeholder {
      color: $gray-700;
    }
  }

  button {
    width: 2rem;
    height: 2rem;
    display: flex;
    padding: 0;
    justify-content: center;
    position: absolute;
    top: 50%;
    right: 1rem;
    transform: translateY(-50%);
    background-color: transparent;
    border: none;

    &:hover,
    &:focus,
    &:active,
    &:active:focus {
      // Some really sticky rules getting applied from BS that need a bit of
      // force.
      background-color: transparent !important;
      box-shadow: none !important;
    }

    svg {
      width: 100%;
      height: 100%;
    }
  }
}
.icon {
  display: inline;
  fill: $blue;
  width: 1.4rem;
  height: 1.4rem;
}
.input-group-text {
  background: transparent;
  border: none;
}
</style>

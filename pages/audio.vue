<template>
  <div>
    <basic-page
      :page-data="$store.state.pageData"
      :highlighted="$store.state.highlightedData"
      :more="$store.state.relatedContent"
      :extended-content="$store.state.extendedContent"
      :sidebar-data="$store.state.sidebarData"
    />
    <card-deck
      cardtype="PoemCard"
      :cards="featuredAudio"
    />
    <b-container>
      <b-row>
        <b-col md="12">
          <app-form>
            <b-form-group class="table-filters">
              <div>
                <legend>Filter by</legend>
              </div>
              <b-form-select
                :disabled="busy"
                inline
                @input="searchAudio(0)"
                v-model="filters.occasion"
                :options="options.occasions"
              >
                <template slot="first">
                  <option
                    :value="null"
                  >
                    Occasions</option>
                </template>
              </b-form-select>
              <b-form-select
                :disabled="busy"
                inline
                @input="searchAudio(0)"
                v-model="filters.theme"
                :options="options.themes"
              >
                <template slot="first">
                  <option
                    :value="null"
                  >
                    Themes</option>
                </template>
              </b-form-select>
              <b-form-select
                :disabled="busy"
                inline
                @input="searchAudio(0)"
                v-model="filters.form"
                :options="options.form"
              >
                <template slot="first">
                  <option
                    :value="null"
                  >
                    Forms</option>
                </template>
              </b-form-select>

              <div class="table-filters__search">
                <b-input-group>
                  <b-form-input
                    :disabled="busy"
                    v-model="filters.combine"
                    type="text"
                    size="22"
                    placeholder="Search title or text ..."
                  />
                  <b-input-group-append
                    is-text
                    class="icon--search"
                  >
                    <magnifying-glass-icon class="icon mr-2" />
                  </b-input-group-append>
                </b-input-group>
              </div>

            </b-form-group>
          </app-form>
        </b-col>
      </b-row>
    </b-container>

    <b-container>
      <b-table
        id="audio"
        :items="audios"
        :fields="fields"
        stacked="md"
        :per-page="perPage"
      >
        <template
          slot="title"
          slot-scope="data"
        >
          <a
            :href="data.item.view_node"
            v-html="replaceFileUrl(data.item.title)"
          />
        </template>
        <template
          slot="field_author"
          slot-scope="data"
        >
          <a
            v-html="data.item.field_author"
          />
        </template>
      </b-table>
      <div class="pager">
        <b-pagination
          @input="paginate"
          :disabled="busy"
          aria-controls="audio"
          class="pagination"
          hide-goto-end-buttons
          :per-page="perPage"
          size="lg"
          :total-rows="rows"
          v-model="page"
          align="fill"
        >
          <span slot="prev-text">
            <iconMediaSkipBackwards /> Prev
          </span>
          <span slot="next-text">
            Next
            <iconMediaSkipForwards />
          </span>
        </b-pagination>
      </div>
    </b-container>
  </div>
</template>

<script>
import _ from "lodash";
import qs from "qs";
import filterHelpers from "~/plugins/filter-helpers";
import BasicPage from "~/components/BasicPage";
import CardDeck from "~/components/CardDeck";
import iconMediaSkipBackwards from "~/static/icons/media-skip-backwards.svg";
import iconMediaSkipForwards from "~/static/icons/media-skip-forwards.svg";
import MagnifyingGlassIcon from "~/node_modules/open-iconic/svg/magnifying-glass.svg";
import MetaTags from "~/plugins/metatags";

// Helper to build out query
const buildQuery = (filters = {}) =>
  _.pickBy({
    combine: filters.combine,
    field_form_target_id: filters.form,
    field_occasion_target_id: filters.occasion,
    field_poem_themes_target_id: filters.theme
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
    return MetaTags.renderTags(this.$route, this.$store.state.metatags);
  },
  data() {
    return {
      audios: [],
      busy: true,
      fields: [
        {
          key: "title",
          label: "Title"
        },
        {
          key: "field_author",
          label: "Author"
        },
        {
          key: "field_date_published",
          label: "Year"
        }
      ],
      filters: {
        combine: null,
        form: null,
        occasion: null,
        theme: null
      },
      options: {
        occasions: [],
        themes: [],
        form: []
      },
      page: 1,
      pageCache: [],
      perPage: 20,
      rows: 0
    };
  },
  mounted() {
    // Get all the data we need for search
    Promise.all([
      this.searchAudio(),
      this.getFilter("occasions"),
      this.getFilter("themes"),
      this.getFilter("form")
    ]);
    // Spin up a debouncing func for text input
    this.debouncedSearchAudio = _.debounce(this.searchAudio, 700);
  },
  methods: {
    getFilter(filter) {
      const fields = "name,drupal_internal__tid";
      const query = _.set({}, `fields[taxonomy_term--${filter}]`, fields);
      this.$api.getTerm(filter, { query }).then(response => {
        this.options[filter] = filterHelpers.map2Options(
          _.get(response, "data.data", [])
        );
      });
    },
    searchAudio(page = 0) {
      this.busy = true;
      const query = _.merge({}, buildQuery(this.filters), { page });
      this.$api.searchAudio({ query }).then(response => {
        this.audios = _.get(response, "data.rows", []);
        this.page = _.get(response, "data.pager.current_page", 1) + 1;
        this.rows = _.get(response, "data.pager.total_items", 0);
        this.busy = false;
      });
      let pageString = `/audio?page=${query.page}`;
      if (!_.isEmpty(query.combine)) {
        pageString += `&combine=${query.combine}`;
      }
      if (query.field_occasion_target_id) {
        pageString += `&field_occasion_tid=${query.field_occasion_target_id}`;
      }
      if (query.field_poem_themes_target_id) {
        pageString += `&field_poem_themes_tid=${
          query.field_poem_themes_target_id
        }`;
      }
      if (query.field_form_target_id) {
        pageString += `&field_form_tid=${query.field_form_target_id}`;
      }
      this.$ga.page(pageString);
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
      this.debouncedSearchAudio();
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
.table-filters {
  .table-filters__search {
    min-width: 15rem;

    @include media-breakpoint-up(lg) {
      min-width: 17rem;
    }
  }
}
</style>

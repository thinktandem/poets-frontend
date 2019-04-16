<template>
  <div>
    <CardDeck
      title=""
      cardtype="Poet"
      :cards="featuredPoets"/>
    <b-container>
      <b-row>
        <b-col md="12">
          <app-form>
            <b-form-group>
              <div>
                <div>
                  <legend>Filter by</legend>
                </div>
                <b-form-select
                  :disabled="busy"
                  inline
                  @input="searchPoets(0)"
                  v-model="filters.state"
                  :options="options.states">
                  <template slot="first">
                    <option
                      :value="null"
                      disabled>
                      State</option>
                  </template>
                </b-form-select>
                <b-form-select
                  :disabled="busy"
                  inline
                  @input="searchPoets(0)"
                  v-model="filters.school"
                  :options="options.schools">
                  <template slot="first">
                    <option
                      :value="null"
                      disabled>
                      Schools & Movements</option>
                  </template>
                </b-form-select>
              </div>

              <div>
                <b-input-group>
                  <b-form-input
                    :disabled="busy"
                    v-model="filters.combine"
                    type="text"
                    size="22"
                    placeholder="Search by poet, movement, etc..."/>
                  <b-input-group-append is-text>
                    <magnifying-glass-icon class="icon mr-2"/>
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
        id="poets"
        :items="poets"
        :fields="fields"
        stacked="md"
        :per-page="perPage">
        <template
          slot="poets"
          slot-scope="data">
          <a
            :href="data.item.view_node"
            v-html="data.item.poets"/>
        </template>
        <template
          slot="years"
          slot-scope="data">
          {{ data.item.field_dob }} - {{ data.item.field_dod }}
        </template>
      </b-table>
      <div class="pager">
        <b-pagination
          @input="paginate"
          :disabled="busy"
          aria-controls="poets"
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
import filterHelpers from "~/plugins/filter-helpers";
import iconMediaSkipBackwards from "~/static/icons/media-skip-backwards.svg";
import iconMediaSkipForwards from "~/static/icons/media-skip-forwards.svg";
import MagnifyingGlassIcon from "~/node_modules/open-iconic/svg/magnifying-glass.svg";
import CardDeck from "~/components/CardDeck";
import MetaTags from "~/plugins/metatags";

// Helper to build out query
const buildQuery = (filters = {}) =>
  _.pickBy({
    combine: filters.combine,
    school: filters.school,
    state: filters.state
  });

export default {
  components: {
    iconMediaSkipBackwards,
    iconMediaSkipForwards,
    CardDeck,
    MagnifyingGlassIcon
  },
  head() {
    return MetaTags.renderTags(this.$store.state.metatags);
  },
  data() {
    return {
      busy: true,
      fields: [
        {
          key: "poets",
          label: "Poet"
        },
        {
          key: "field_school_movement",
          label: "Schools and Movements"
        },
        {
          key: "years",
          label: "Years"
        }
      ],
      filters: {
        combine: null,
        school: null,
        state: null
      },
      options: {
        schools: [],
        states: []
      },
      page: 1,
      pageCache: [],
      perPage: 20,
      poets: [],
      rows: 0
    };
  },
  mounted() {
    // Get all the data we need for search
    Promise.all([this.searchPoets(), this.getSchools(), this.getStates()]);
    // Spin up a debouncing func for text input
    this.debouncedSearchPoets = _.debounce(this.searchPoets, 700);
  },
  methods: {
    searchPoets(page = 0) {
      this.busy = true;
      const query = _.merge({}, buildQuery(this.filters), { page });
      this.$api.searchPoets({ query }).then(response => {
        this.poets = _.get(response, "data.rows", []);
        this.page = _.get(response, "data.pager.current_page", 1) + 1;
        this.rows = _.get(response, "data.pager.total_items", 0);
        this.busy = false;
      });
    },
    getSchools() {
      const fields = "name,drupal_internal__tid";
      const query = _.set({}, "fields[taxonomy_term--school_movement]", fields);
      this.$api.getTerm("school_movement", { query }).then(response => {
        this.options.schools = filterHelpers.map2Options(
          _.get(response, "data.data", [])
        );
      });
    },
    getStates() {
      const fields = "title,drupal_internal__nid";
      const query = _.set({}, "fields[node--state]", fields);
      this.$api.getTerm("state", { query }, "node").then(response => {
        this.options.states = filterHelpers.map2Options(
          _.get(response, "data.data", []),
          "attributes.title",
          "attributes.drupal_internal__nid"
        );
      });
    },
    paginate() {
      this.busy = true;
      // @NOTE: drupal starts at page 0, bPagination starts at 1
      // https://en.wikipedia.org/wiki/Off-by-one_error
      const queryPage = this.page - 1;
      this.searchPoets(queryPage);
    }
  },
  watch: {
    "filters.combine": function() {
      this.debouncedSearchPoets();
    }
  },
  async asyncData({ app, store, params, query }) {
    // @TODO: add this to api v2
    let poets = await app.$axios
      .get("/api/node/person", {
        params: {
          filter: {
            status: 1,
            field_p_type: "poet",
            img: {
              condition: {
                path: "field_image.id",
                operator: "<>",
                value: null
              }
            }
          },
          page: {
            limit: 3
          },
          sort: "-field_featured",
          include: "field_image"
        }
      })
      .then(res => {
        return {
          rows: _.map(_.get(res, "data.data"), row => {
            return {
              row,
              name: _.get(row, "attributes.title", null),
              bio:
                _.get(row, "attributes.body.summary", null) ||
                _.get(row, "attributes.body.processed", null),
              img: app.$buildImg(res.data, row, "field_image", "portrait", {
                src: "/images/default-person.png",
                alt: _.get(row, "attributes.title") + " portrait"
              }),
              link: _.get(row, "attributes.path.alias", null)
            };
          })
        };
      })
      .catch(err => {
        console.log(err);
      });

    return {
      featuredPoets: poets.rows
    };
  },
  async fetch({ app, store, params, query }) {
    return app.$buildBasicPage(app, store, "/poets");
  }
};
</script>

<style scoped lang="scss">
</style>

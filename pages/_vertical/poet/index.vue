<template>
  <div>
    <!-- <h2
      class="styleguide__heading"
      id="PoetsDeck"
      >Poets Card Deck</h2> -->
    <CardDeck
      title="Poets"
      cardtype="Poet"
      :cards="$store.state.featuredPoets"
      :link="poetsLink"
    />geoff
    <b-container class="poets-list__filters filters">
      <b-row class="poets-list__filters-row">
        <b-col md="12">
          <b-form
            class="poets-list__search"
            @submit.stop.prevent="applyFilters"
          >
            <b-form-group @submit.stop.prevent="applyFilters">
              <div class="legend-selects">

                <div class="poets-list__filters__legend">
                  <legend>Filter by</legend>
                </div>
                <b-form-select
                  inline
                  v-model="stateInput"
                >
                  <option :value="null">State</option>
                  <option
                    v-for="(opt, i) in $store.state.states"
                    :key="`opt-${i}`"
                    :value="i"
                  >{{ opt }}</option>
                </b-form-select>
                <b-form-select
                  v-model="schoolInput"
                  inline
                >
                  <option :value="null">Schools & Movements</option>
                  <option
                    v-for="(opt, i) in $store.state.filterOptions"
                    :key="`opt-${i}`"
                    :value="opt"
                  >{{ i }}</option>
                </b-form-select>
              </div>

              <div class="poets-list__input--search">
                <b-form-input
                  v-model="searchInput"
                  type="text"
                  size="22"
                  placeholder="Search by poet, movement, etc..."
                />
                <b-btn class="btn-primary">
                  <iconSearch />
                </b-btn>
              </div>
            </b-form-group>
          </b-form>
        </b-col>
      </b-row>
    </b-container>
    <b-container class="poets-list tabular-list">
      <b-row class="tabular-list__row tabular-list__header">
        <b-col md="4">
          Name
        </b-col>
        <b-col md="4">
          Years
        </b-col>
        <b-col md="4">
          Schools and Movements
        </b-col>
      </b-row>
      <b-row
        v-for="poet in results"
        class="tabular-list__row poets-list__poems"
        :key="poet.id"
      >
        <b-col md="4">
          <a
            :href="poet.view_node"
            v-html="poet.poets"
          />
        </b-col>
        <b-col md="4">
          {{ poet.field_dob }} - {{ poet.field_dod }}
        </b-col>
        <b-col md="4">
          {{ poet.field_school_movement }}
        </b-col>
      </b-row>
      <div class="pager">
        <ul
          role="menubar"
          aria-disabled="false"
          aria-label="Pagination"
          class="pagination"
        >
          <li
            role="none presentation"
            aria-hidden="true"
            class="page-item"
            :class="{ disabled: !currentPage}"
          >
            <a
              :href="`/poetsorg/poet?page=${Prev}${preparedState}${preparedSchool}${preparedCombine}`"
              class="page-link"
            >
              <iconMediaSkipBackwards /> Prev
            </a>
          </li>
          <li
            role="none presentation"
            aria-hidden="true"
            class="page-item"
          >
            <a
              v-if="pageNum + 1 < totalPages"
              :href="`/poetsorg/poet?page=${pageNum + 1}${preparedState}${preparedSchool}${preparedCombine}`"
              class="page-link"
            >
              {{ pageNum + 1 }}
            </a>

          </li>
          <li
            role="none presentation"
            aria-hidden="true"
            class="page-item"
          >
            <a
              v-if="pageNum + 2 < totalPages"
              :href="`/poetsorg/poet?page=${pageNum + 2}${preparedState}${preparedSchool}${preparedCombine}`"
              class="page-link"
            >
              {{ pageNum + 2 }}
            </a>
          </li>

          <li
            role="none presentation"
            aria-hidden="true"
            class="page-item"
          >
            <a
              v-if="pageNum + 3 < totalPages"
              :href="`/poetsorg/poet?page=${pageNum + 3}${preparedState}${preparedSchool}${preparedCombine}`"
              class="page-link"
            >
              {{ pageNum + 3 }}
            </a>
          </li>
          <li
            role="none presentation"
            aria-hidden="true"
            class="page-item ellipsis"
          >
            <span>&hellip;</span>
          </li>
          <li
            role="none presentation"
            aria-hidden="true"
            class="page-item"
          >
            <a
              v-if="pageNum + 1 < totalPages"
              :href="`/poetsorg/poet?page=${totalPages - 1}${preparedState}${preparedSchool}${preparedCombine}`"
              class="page-link"
            >
              {{ totalPages }}
            </a>
          </li>
          <li
            role="none presentation"
            aria-hidden="true"
            class="page-item"
          >
            <a
              :href="`/poetsorg/poet?page=${Next}${preparedCombine}${preparedSchool}${preparedState}`"
              class="page-link"
              :class="{disabled: !Next}"
            >
              Next
              <iconMediaSkipForwards />
            </a>

          </li>
        </ul>
      </div>
    </b-container>
  </div>
</template>

<script>
// import qs from "qs";
import _ from "lodash";
import filterHelpers from "~/plugins/filter-helpers";
import searchHelpers from "~/plugins/search-helpers";
import iconMediaSkipBackwards from "~/static/icons/media-skip-backwards.svg";
import iconMediaSkipForwards from "~/static/icons/media-skip-forwards.svg";
import iconSearch from "~/static/icons/magnifying-glass.svg";
import CardDeck from "~/components/CardDeck";

export default {
  components: {
    iconMediaSkipBackwards,
    iconMediaSkipForwards,
    iconSearch,
    CardDeck
  },
  data() {
    return {
      schoolInput: null,
      stateInput: null,
      searchInput: null,
      results: null,
      Next: null,
      Prev: null,
      preparedState: null,
      preparedSchool: null,
      preparedCombine: null,
      featuredPoets: null
    };
  },
  async asyncData({ app, params, query }) {
    const url = "/api/poets";
    return searchHelpers.getSearchResults(url, app, query);
  },
  async fetch({ app, store, params, query }) {
    const schools = await filterHelpers.getFilterOptions(
      app,
      "/api/taxonomy_term/school_movement",
      "'fields[taxonomy_term--school_movement]': 'drupal_internal__tid,name'",
      "taxonomy"
    );
    const states = await filterHelpers.getFilterOptions(
      app,
      "/api/node/state",
      "'fields[node--state]': 'drupal_internal__nid,title'",
      "node"
    );
    store.commit("updateStates", states.options);
    store.commit("updateFilterOptions", schools.options);

    let poets = await app.$axios
      .get("/api/node/person", {
        params: {
          filter: {
            status: 1,
            field_p_type: "poet"
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
              img: app.$buildImg(res.data, row, "field_image", "portrait")
            };
          }),
          poetsLink: {
            to: "/poetsorg/poet",
            text: `${res.data.meta.count} Poets`
          }
        };
      })
      .catch(err => {
        console.log(err);
      });
    console.log(
      "\n\n --------------------- you do it --------------------\n",
      poets
    );

    store.commit("updateFeaturedPoets", poets);
  },
  methods: {
    applyFilters() {
      let myQuery = {};
      if (this.stateInput) {
        myQuery.state = this.stateInput;
      }
      if (this.searchInput) {
        myQuery.combine = this.searchInput;
      }
      if (this.schoolInput) {
        myQuery.school = this.schoolInput;
      }
      this.$router.push({
        name: "vertical-poet",
        query: myQuery
      });
    }
  },
  watchQuery: true
};
</script>

<style scoped lang="scss">
.poets-list__poems {
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

.poets-list {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.poets-list__search {
  margin-top: 2rem;
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

.poets-list__filters__legend {
  flex-basis: 50%;

  legend {
    margin: 0;
    line-height: 2;
    font-size: $font-size-base;
    color: $gray-700;
  }
}

.poets-list__input--search {
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
</style>

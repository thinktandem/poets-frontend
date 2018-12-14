<template>
  <div>
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
    <b-container class="poets-list">
      <b-row class="poets-list__row">
        <b-col md="4">
          <div class="poets-list__list-header">
            Name
          </div>
        </b-col>
        <b-col md="4">
          <div class="poets-list__list-header">
            Years
          </div>
        </b-col>
        <b-col md="4">
          <div class="poets-list__list-header">
            Schools and Movements
          </div>
        </b-col>
      </b-row>
      <b-row
        v-for="poet in results"
        class="poets-list__row poets-list__poems"
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
      <div class="poets-list__pager">
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
            class="page-item"
          >
            &hellip;
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
import AppPoemADaySignUpForm from "~/components/AppPoemADayPoems/AppPoemADaySignUpForm";
import AppPoems from "~/components/AppPoemADayPoems/AppPoems";
import filterHelpers from "~/plugins/filter-helpers";
import searchHelpers from "~/plugins/search-helpers";
import iconMediaSkipBackwards from "~/static/icons/media-skip-backwards.svg";
import iconMediaSkipForwards from "~/static/icons/media-skip-forwards.svg";
import iconSearch from "~/static/icons/magnifying-glass.svg";

export default {
  components: {
    AppPoemADaySignUpForm,
    AppPoems,
    iconMediaSkipBackwards,
    iconMediaSkipForwards,
    iconSearch
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
      preparedCombine: null
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
      "'fields[taxonomy_term--school_movement]': 'tid,title'",
      "taxonomy"
    );
    const states = await filterHelpers.getFilterOptions(
      app,
      "/api/node/state",
      "'fields[node--state]': 'nid,name'",
      "node"
    );
    store.commit("updateStates", states.options);
    store.commit("updateFilterOptions", schools.options);
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
.poets-list__row {
  border-bottom: 1px solid $gray-400;
  font-size: 18px;
  min-height: 47px;
}
.poets-list__list-header {
  font-weight: bold;
}

.poets-list__poems {
  font-weight: 400;

  > div {
    height: 3.4rem;
    display: flex;
    align-items: center;
    margin-bottom: 0.4rem;
  }

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

.poets-list__pager {
  margin: 2.6rem -12px 0 -12px;
}
</style>

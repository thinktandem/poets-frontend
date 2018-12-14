<template>
  <div>
    <b-container
      fluid
      class="poets-list__filters"
    >
      <b-row class="poets-list__filters-row">
        <b-col
          md="12"
          class="my-1"
        >
          <b-form
            class="poets-list__search"
            @submit.stop.prevent="applyFilters"
          >
            <b-form-group
              @submit.stop.prevent="applyFilters"
              horizontal
              label="Filter by"
              class="mb-0"
            >
              <b-form-select
                class="mb-0"
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
              <b-form-input
                v-model="searchInput"
                type="text"
                size="22"
                placeholder="Search by poet, movement, etc..."
              />
              <b-btn class="btn-primary">
                mag
              </b-btn>
            </b-form-group>
          </b-form>
        </b-col>
      </b-row>
    </b-container>
    <b-container class="poets-list py-5">
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
      <b-row>
        <b-col md="4">
          <div
            v-if="currentPage"
            class="prev-button"
          >
            <a :href="`/poetsorg/poet?page=${Prev}${preparedState}${preparedSchool}${preparedCombine}`">
              &lt;&lt; Prev
            </a>
          </div>
          <div v-else>
            <a :href="`/poetsorg/poet?page=0${preparedState}${preparedSchool}${preparedCombine}`">
              &lt;&lt; First page
            </a>
          </div>
        </b-col>
        <b-col md="4">
          <a
            v-if="pageNum + 1 < totalPages"
            :href="`/poetsorg/poet?page=${pageNum + 1}${preparedState}${preparedSchool}${preparedCombine}`"
          >
            {{ pageNum + 1 }}
          </a>
          <a
            v-if="pageNum + 2 < totalPages"
            :href="`/poetsorg/poet?page=${pageNum + 2}${preparedState}${preparedSchool}${preparedCombine}`"
          >
            {{ pageNum + 2 }}
          </a>
          <a
            v-if="pageNum + 3 < totalPages"
            :href="`/poetsorg/poet?page=${pageNum + 3}${preparedState}${preparedSchool}${preparedCombine}`"
          >
            {{ pageNum + 3 }}
          </a>
          . . .
          <a
            v-if="pageNum + 1 < totalPages"
            :href="`/poetsorg/poet?page=${totalPages - 1}${preparedState}${preparedSchool}${preparedCombine}`"
          >
            {{ totalPages }}
          </a>
        </b-col>
        <b-col md="4">
          <a
            v-if="Next"
            :href="`/poetsorg/poet?page=${Next}${preparedCombine}${preparedSchool}${preparedState}`"
          >
            Next &gt;&gt;
          </a>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import AppPoemADaySignUpForm from "~/components/AppPoemADayPoems/AppPoemADaySignUpForm";
import AppPoems from "~/components/AppPoemADayPoems/AppPoems";
import FilterTable from "~/components/FilterTable";
import filterHelpers from "~/plugins/filter-helpers";
import searchHelpers from "~/plugins/search-helpers";
export default {
  components: {
    AppPoemADaySignUpForm,
    AppPoems,
    FilterTable
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
  border-bottom: 1px solid #ccc;
  font-size: 18px;
  min-height: 47px;
}
.poets-list__list-header {
  font-weight: bold;
}
.poets-list__poems {
  font-weight: 111;
}
</style>

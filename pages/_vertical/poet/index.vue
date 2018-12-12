<template>
  <div>
    <b-container
      fluid
      class="poets-list__filters">
      <b-row class="poets-list__filters-row">
        <b-col
          md="12"
          class="my-1">
          <b-form-group
            @submit.prevent="applyFilters"
            horizontal
            label="Filter by"
            class="mb-0">
            <b-form-select
              class="mb-0"
              inline
              v-model="staters">
              <option :value="null">State</option>
              <option
                v-for="(opt, i) in $store.state.states"
                :key="`opt-${i}`"
                :value="i">{{ opt }}</option>
            </b-form-select>
            <b-form-select
              v-model="selected"
              inline>
              <option :value="null">Schools & Movements</option>
              <option
                v-for="(opt, i) in $store.state.filterOptions"
                :key="`opt-${i}`"
                :value="opt">{{ i }}</option>
            </b-form-select>
            <b-form-input
              v-model="filterText"
              type="text"
              size="22"
              placeholder="Search by poet, movement, etc..."/>
            <b-btn
              class="btn-primary"
              @click="TODO">
              mag
            </b-btn>
          </b-form-group>
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
        v-for="poet in poets"
        class="poets-list__row poets-list__poems"
        :key="poet.id">
        <b-col md="4">
          <a
            :href="poet.view_node"
            v-html="poet.poets"/>
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
          <a :href="`/poets?page=${Prev}`">
            &lt;&lt; Prev
          </a>
        </b-col>
        <b-col md="4">
          <a href="/poets?page=1">
            1
          </a>
          <a href="/poets?page=2">
            2
          </a>
          <a href="/poets?page=3">
            3
          </a>
          . . .
          <a :href="`/poets?page=${$store.state.numPages.numPages}`">
            {{ $store.state.numPages.numPages }}
          </a>
        </b-col>
        <b-col md="4">
          <a
            v-if="$store.state.numPages.numPages > Next"
            :href="`/poets?page=${Next}`">
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
import PoetList from "~/components/PoetList";
import paginationHelpers from "~/plugins/pagination-helpers";
import filterHelpers from "~/plugins/filter-helpers";
export default {
  components: {
    AppPoemADaySignUpForm,
    AppPoems,
    PoetList
  },
  data() {
    return {
      selected: null,
      staters: null
    };
  },
  async asyncData({ app, params, query }) {
    const pageLinks = paginationHelpers.getPageLinks(query);
    return app.$axios
      .get(`/api/poets`, {
        params: {
          page: pageLinks.pageNum
        }
      })
      .then(res => {
        return {
          poets: res.data,
          pageNum: pageLinks.pageNum,
          Prev: pageLinks.Prev,
          Next: pageLinks.Next
        };
      })
      .catch(err => {
        console.log(err);
      });
  },
  async fetch({ app, store, params, query }) {
    const schools = await filterHelpers.getFilterOptions(
      app,
      "/api/taxonomy_term/school_movement",
      "'fields[taxonomy_term--school_movement]': 'tid,name'"
    );
    const states = await filterHelpers.getStates();
    store.commit("updateStates", states);
    store.commit("updateFilterOptions", schools.options);

    const numPages = await paginationHelpers.getNumPages(
      app,
      "/api/node/person",
      20
    );
    store.commit("updateNumPages", numPages);
  },
  methods: {
    getPoetTitle(viewNode) {
      const title = viewNode.split("/");
      return title[3];
    }
  }
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

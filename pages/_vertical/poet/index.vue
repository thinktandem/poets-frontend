<template>
  <div>
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
        :key="poet.id"
      >
        <b-col md="4">
          <a :href="`/poets/${getPoetTitle(poet.view_node)}`">
            {{ poet.poets }}
          </a>
        </b-col>
        <b-col md="4">
          {{ poet.nothing }}
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
            :href="`/poets?page=${Next}`"
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
import paginationHelpers from "~/plugins/pagination-helpers";
export default {
  components: {
    AppPoemADaySignUpForm,
    AppPoems,
    FilterTable
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
  async fetch({ app, store, params }) {
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

<template>
  <div>
    <b-container class="poems-list py-5">
      <b-row class="poems-list__row">
        <b-col md="4">
          <div class="poems-list__list-header">
            Name
          </div>
        </b-col>
        <b-col md="4">
          <div class="poems-list__list-header">
            Years
          </div>
        </b-col>
        <b-col md="4">
          <div class="poems-list__list-header">
            Schools and Movements
          </div>
        </b-col>
      </b-row>
      <b-row
        v-for="poem in poems"
        class="poems-list__row poems-list__poems"
        :key="poem.id">
        <b-col md="4">
          <a :href="`/poems/${getPoemTitle(poem.view_node)}`">
            {{ poem.title }}
          </a>
        </b-col>
        <b-col md="4">
          {{ poem.nothing }}
        </b-col>
        <b-col md="4">
          {{ poem.field_school_movement }}
        </b-col>
      </b-row>
      <b-row>
        <b-col md="4">
          <a :href="`/poems?page=${Prev}`">
            &lt;&lt; Prev
          </a>
        </b-col>
        <b-col md="4">
          <a href="/poems?page=1">
            1
          </a>
          <a href="/poems?page=2">
            2
          </a>
          <a href="/poems?page=3">
            3
          </a>
          . . .
          <a :href="`/poems?page=${$store.state.numPages.numPages}`">
            {{ $store.state.numPages.numPages }}
          </a>
        </b-col>
        <b-col md="4">
          <a
            v-if="$store.state.numPages.numPages > Next"
            :href="`/poems?page=${Next}`">
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
import paginationHelpers from "~/plugins/pagination-helpers";
export default {
  components: { AppPoemADaySignUpForm, AppPoems },
  async asyncData({ app, params, query }) {
    const pageLinks = paginationHelpers.getPageLinks(query);
    return app.$axios
      .get(`/api/poems`, {
        params: {
          page: pageLinks.pageNum
        }
      })
      .then(res => {
        return {
          poems: res.data,
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
      "/api/node/poems",
      50
    );
    store.commit("updateNumPages", numPages);
  },
  methods: {
    getPoemTitle(viewNode) {
      const title = viewNode.split("/");
      return title[3];
    }
  }
};
</script>

<style scoped lang="scss">
.poems-list__row {
  border-bottom: 1px solid #ccc;
  font-size: 18px;
  min-height: 47px;
}
.poems-list__list-header {
  font-weight: bold;
}
.poems-list__poems {
  font-weight: 111;
}
</style>

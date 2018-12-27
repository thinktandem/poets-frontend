<template>
  <div>
    <h1>Search Results</h1>
    <b-container v-if="!totalPages">
      Your search didn't turn up any results.
    </b-container>
    <b-container
      v-else
      class="results-list py-5"
    >
      <b-row
        v-for="(result, i) in results"
        class="results-list__row"
        :key="`result.view_node-${i}`"
      >
        <b-col md="12">
          <div class="result-type">
            {{ result.type }}
          </div>
          <div class="result-title">
            <a :href="`/${result.type}/${result.view_node}`">
              {{ result.title }}
            </a>
          </div>
          <div
            class="result-body"
            v-html="result.body"
          />
        </b-col>
      </b-row>
      <b-row>
        <b-col md="4">
          <div
            v-if="currentPage"
            class="prev-button"
          >
            <a :href="`/search?page=${Prev}&combine=${combine}`">
              &lt;&lt; Prev
            </a>
          </div>
          <div v-else>
            <a :href="`/search?page=0&combine=${combine}`">
              &lt;&lt; First page
            </a>
          </div>
        </b-col>
        <b-col md="4">
          <a
            v-if="pageNum + 1 < totalPages"
            :href="`/search?page=${pageNum + 1}&combine=${combine}`"
          >
            {{ pageNum + 1 }}
          </a>
          <a
            v-if="pageNum + 2 < totalPages"
            :href="`/search?page=${pageNum + 2}&combine=${combine}`"
          >
            {{ pageNum + 2 }}
          </a>
          <a
            v-if="pageNum + 3 < totalPages"
            :href="`/search?page=${pageNum + 3}&combine=${combine}`"
          >
            {{ pageNum + 3 }}
          </a>
          . . .
          <a
            v-if="pageNum + 1 < totalPages"
            :href="`/search?page=${totalPages - 1}&combine=${combine}`"
          >
            {{ totalPages }}
          </a>
        </b-col>
        <b-col md="4">
          <a
            v-if="Next"
            :href="`/search?page=${Next}&combine=${combine}`"
          >
            Next &gt;&gt;
          </a>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import FilterTable from "../../components/FilterTable";
import searchHelpers from "~/plugins/search-helpers";
export default {
  components: {
    FilterTable
  },
  data() {
    return {
      query: {
        combine: ""
      }
    };
  },
  async asyncData({ app, query }) {
    const url = "/api/search";
    return searchHelpers.getSearchResults(url, app, query);
  },
  methods: {},
  watchQuery: ["combine"]
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

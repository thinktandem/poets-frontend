<template>
  <div>
    <h3 class="poem-a-day__previous-poems-title">
      Previous Poems
    </h3>
    <b-container
      fluid
      class="poem-a-day__previous-poems">
      <b-row>
        <b-col
          class="poem-a-day__previous-poems-header"
          md="4">
          Date
        </b-col>
        <b-col
          class="poem-a-day__previous-poems-header"
          md="4">
          Title
        </b-col>
        <b-col
          class="poem-a-day__previous-poems-header"
          md="4">
          Poet
        </b-col>
      </b-row>
      <b-row
        v-for="(poem, i) in results"
        :key="`poem-${i}`">
        <b-col md="4">
          <a :href="poem.view_node">
            {{ poem.field_poem_of_the_day_date }}
          </a>
        </b-col>
        <b-col md="4">
          {{ poem.title }}
        </b-col>
        <b-col md="4">
          {{ poem.field_author }}
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
import searchHelpers from "~/plugins/search-helpers";
export default {
  components: { AppPoemADaySignUpForm, AppPoems },
  data() {
    return {
      results: null,
      Prev: null,
      Next: null
    };
  },
  async asyncData({ app, params, query }) {
    const url = "/api/previous-poems";
    return searchHelpers.getSearchResults(url, app, query);
  }
};
</script>

<style scoped lang="scss">
.card--main {
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.05), 0 4px 0 0 var(--green);
  .card-title {
    font-size: 2.5rem;
  }

  .card-subtitle {
    font-family: $font-family-sans-serif;
    font-size: 1.25rem;
    line-height: 1.75rem;
    color: var(--black);
  }

  .card-body {
    font-size: 1.25rem;
    line-height: 1.87rem;
    font-family: $font-family-serif;
  }
  .card--poem__attribution {
    font-family: $font-family-serif;
    font-size: 0.8rem;
    line-height: 1.25rem;
  }
}

.poet--aside__bio {
  font-size: 0.9rem;
  line-height: 1.07rem;
}
</style>

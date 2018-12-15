<template>
  <div>
    <b-container class="poem-a-day__previous-poems tabular-list">
      <b-row>
        <h3 class="poem-a-day__previous-poems-title">
          Previous Poems
        </h3>
      </b-row>
      <b-row class="tabular-list__row tabular-list__header">
        <b-col md="4">
          Date
        </b-col>
        <b-col md="4">
          Title
        </b-col>
        <b-col md="4">
          Poet
        </b-col>
      </b-row>
      <b-row
        v-for="(poem, i) in results"
        :key="`poem-${i}`"
        class="tabular-list__row"
      >
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
              :href="`/poetsorg/poem-a-day?page=${Prev}${preparedState}${preparedSchool}${preparedCombine}`"
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
              :href="`/poetsorg/poem-a-day?page=${pageNum + 1}${preparedState}${preparedSchool}${preparedCombine}`"
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
              :href="`/poetsorg/poem-a-day?page=${pageNum + 2}${preparedState}${preparedSchool}${preparedCombine}`"
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
              :href="`/poetsorg/poem-a-day?page=${pageNum + 3}${preparedState}${preparedSchool}${preparedCombine}`"
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
              :href="`/poetsorg/poem-a-day?page=${totalPages - 1}${preparedState}${preparedSchool}${preparedCombine}`"
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
              :href="`/poetsorg/poem-a-day?page=${Next}${preparedCombine}${preparedSchool}${preparedState}`"
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
import searchHelpers from "~/plugins/search-helpers";
import iconMediaSkipBackwards from "~/static/icons/media-skip-backwards.svg";
import iconMediaSkipForwards from "~/static/icons/media-skip-forwards.svg";

export default {
  components: {
    AppPoemADaySignUpForm,
    AppPoems,
    iconMediaSkipBackwards,
    iconMediaSkipForwards
  },
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

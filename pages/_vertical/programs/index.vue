<template>
  <div>
    <b-container class="programs-list tabular-list">
      <b-row class="tabular-list__row tabular-list__header">
        <b-col
          md="3">
          Date
        </b-col>
        <b-col md="6">
          Title
        </b-col>
        <b-col md="3">
          Author
        </b-col>
      </b-row>
      <b-row
        v-for="programs in results"
        class="tabular-list__row prizes-list__books"
        :key="programs.title"
      >
        <b-col
          class="date"
          md="3"
        >
          {{ programs.field_date_published }}
        </b-col>
        <b-col
          class="books-list__books-title"
          md="6">
          <a
            :href="programs.view_node"
            v-html="programs.title"
          />
        </b-col>
        <b-col md="3">
          {{ programs.field_author }}
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
              :href="`/programs?page=${Prev}${preparedCombine}`"
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
              :href="`/programs?page=${pageNum + 1}{preparedCombine}`"
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
              :href="`/programs?page=${pageNum + 2}${preparedCombine}`"
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
              :href="`/programs?page=${pageNum + 3}${preparedCombine}`"
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
              :href="`/programs?page=${totalPages - 1}${preparedCombine}`"
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
              :href="`/programs?page=${Next}${preparedCombine}`"
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
import searchHelpers from "~/plugins/search-helpers";
import iconMediaSkipBackwards from "~/static/icons/media-skip-backwards.svg";
import iconMediaSkipForwards from "~/static/icons/media-skip-forwards.svg";
import iconSearch from "~/static/icons/magnifying-glass.svg";

export default {
  components: {
    iconMediaSkipBackwards,
    iconMediaSkipForwards,
    iconSearch
  },
  data() {
    return {
      combinedInput: null,
      results: null,
      Next: null,
      Prev: null,
      preparedCombine: null
    };
  },
  async asyncData({ app, params, query }) {
    const url = "/api/prize_list";
    return searchHelpers.getSearchResults(url, app, query);
  },
  methods: {
    applyFilters() {
      let myQuery = {};
      if (this.combinedInput) {
        myQuery.combine = this.combinedInput;
      }
      this.$router.push({
        name: "vertical-prizes",
        query: myQuery
      });
    }
  },
  watchQuery: true
};
</script>

<style scoped lang="scss">
.books-list__books {
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
.tabular-list__header {
  background-color: #f2f8fa;
  text-transform: uppercase;
  font-weight: 560;
}
.date {
  color: var(--red-dark);
}
.books-list__books-title {
  min-height: 88px;
}
.books-list__books-title a {
  color: var(--gray-800);
  font-weight: 560;
}
.books-list {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.books-list__search {
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

.books-list__filters__legend {
  flex-basis: 50%;

  legend {
    margin: 0;
    line-height: 2;
    font-size: $font-size-base;
    color: $gray-700;
  }
}

.books-list__input--search {
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

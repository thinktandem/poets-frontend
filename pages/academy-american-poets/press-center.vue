<template>
  <div>
    <BasicPage
      :page-data="$store.state.pageData"
      highlighted=""/>
    <b-container class="press-list__filters filters">
      <b-row class="press-list__filters-row">
        <b-col md="12">
          <b-form
            class="press-list__search"
            @submit.stop.prevent="applyFilters"
          >
            <b-form-group>
              <div class="legend-selects">
                <div class="press-list__filters__legend">
                  <legend>Filter by</legend>
                </div>
              </div>
              <div class="press-list__input--search">
                <b-form-input
                  v-model="combinedInput"
                  type="text"
                  size="22"
                  placeholder="Search title or text ..."
                />
                <b-btn
                  class="btn-primary"
                  @submit.stop.prevent="applyFilters"
                >
                  <iconSearch />
                </b-btn>
              </div>
            </b-form-group>
          </b-form>
        </b-col>
      </b-row>
    </b-container>
    <b-container class="texts-list press-list">
      <b-col
        md="12"
        v-for="text in results"
        class="press-list__row press-list__texts"
        :key="text.title"
      >
        <div
          class="date"
        >
          {{ niceDate(text.field_date_published) }}
        </div>
        <div class="press-list__texts-title">
          <a
            :href="text.view_node"
            v-html="text.title"
          />
        </div>
        <div
          class="press__body"
          v-html="text.body"/>
      </b-col>
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
              :href="`/academy-american-poets/press-center?page=${Prev}${preparedCombine}`"
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
              :href="`/academy-american-poets/press-center?page=${pageNum + 1}{preparedCombine}`"
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
              :href="`/academy-american-poets/press-center?page=${pageNum + 2}${preparedCombine}`"
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
              :href="`/academy-american-poets/press-center?page=${pageNum + 3}${preparedCombine}`"
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
              :href="`/academy-american-poets/press-center?page=${totalPages - 1}${preparedCombine}`"
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
              :href="`/academy-american-poets/press-center?page=${Next}${preparedCombine}`"
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
import niceDate from "~/plugins/niceDate";
import searchHelpers from "~/plugins/search-helpers";
import iconMediaSkipBackwards from "~/static/icons/media-skip-backwards.svg";
import iconMediaSkipForwards from "~/static/icons/media-skip-forwards.svg";
import iconSearch from "~/static/icons/magnifying-glass.svg";
import BasicPage from "~/components/BasicPage";

export default {
  components: {
    iconMediaSkipBackwards,
    iconMediaSkipForwards,
    iconSearch,
    BasicPage
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
  async asyncData({ app, store, params, query }) {
    const url = "/api/aap_press_center";
    const mySearchHelpers = await searchHelpers.getSearchResults(
      url,
      app,
      query
    );

    return {
      combinedInput: mySearchHelpers.combinedInput,
      results: mySearchHelpers.results,
      Next: mySearchHelpers.Next,
      Prev: mySearchHelpers.Prev,
      preparedCombine: mySearchHelpers.preparedCombine,
      totalPages: mySearchHelpers.totalPages,
      pageNum: mySearchHelpers.pageNum,
      currentPage: mySearchHelpers.currentPage
    };
  },
  async fetch({ app, store, params }) {
    return app.$buildBasicPage(
      app,
      store,
      "/academy-american-poets/press-center"
    );
  },
  methods: {
    applyFilters() {
      let myQuery = {};
      if (this.combinedInput) {
        myQuery.combine = this.combinedInput;
      }
      this.$router.push({
        name: "academy-american-poets-press-center",
        query: myQuery
      });
    },
    niceDate(date) {
      return niceDate.niceDate(date);
    }
  },
  watchQuery: true
};
</script>

<style scoped lang="scss">
.press-list__texts {
  font-weight: 400;
  text-align: left;
  a {
    color: $body-color;

    &:hover,
    &:focus,
    &:active {
      text-decoration: underline;
    }
  }
}
.press-list__header {
  background-color: #f2f8fa;
  text-transform: uppercase;
  font-weight: 560;
}
.date {
  color: var(--red-dark);
}
.press-list__texts-title {
  margin-bottom: 1rem;
}
.press-list__texts-title a {
  color: var(--gray-800);
  font-weight: 560;
}
.texts-list {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.press-list__search {
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

.press-list__filters__legend {
  flex-basis: 50%;

  legend {
    margin: 0;
    line-height: 2;
    font-size: $font-size-base;
    color: $gray-700;
  }
}

.press-list__input--search {
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
.press-list__row {
  margin-top: 22px;
  border-bottom: 1px solid var(--gray-600);
}
</style>

<template>
  <div>
    <b-container class="jobs-list tabular-list">
      <b-row class="tabular-list__row tabular-list__header">
        <b-col
          xl="4">
          Title
        </b-col>
        <b-col xl="8">
          Description
        </b-col>
      </b-row>
      <b-row
        v-for="job in results"
        class="tabular-list__row jobs-list__jobs"
        :key="job.title"
      >
        <b-col
          class="jobs-list__jobs-title"
          xl="4">
          <a
            :href="job.path"
            v-html="job.title"
          />
        </b-col>
        <b-col xl="8">
          <div v-html="job.body"/>
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
              :href="`/jobs?page=${Prev}${preparedCombine}`"
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
              :href="`/jobs?page=${pageNum + 1}{preparedCombine}`"
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
              :href="`/jobs?page=${pageNum + 2}${preparedCombine}`"
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
              :href="`/jobs?page=${pageNum + 3}${preparedCombine}`"
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
              :href="`/jobs?page=${totalPages - 1}${preparedCombine}`"
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
              :href="`/jobs?page=${Next}${preparedCombine}`"
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

export default {
  components: {
    iconMediaSkipBackwards,
    iconMediaSkipForwards
  },
  async asyncData({ app, store, params, query }) {
    const url = "/api/jobs";
    const mySearchHelpers = await searchHelpers.getSearchResults(
      url,
      app,
      query
    );
    let jobs = await app.$axios
      .get("/api/jobs", {})
      .then(res => {
        return {
          rows: res.data.rows
        };
      })
      .catch(err => {
        console.log(err);
      });

    return {
      results: mySearchHelpers.results,
      Next: mySearchHelpers.Next,
      Prev: mySearchHelpers.Prev,
      jobs: jobs.rows
    };
  },
  async fetch({ app, store, route }) {
    return app.$buildBasicPage(app, store, route.path);
  },
  methods: {
    applyFilters() {
      let myQuery = {};
      if (this.combinedInput) {
        myQuery.combine = this.combinedInput;
      }
      this.$router.push({
        name: "vertical-text",
        query: myQuery
      });
    }
  },
  watchQuery: true
};
</script>

<style scoped lang="scss">
.jobs-list__jobs {
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
.tabular-list__row > div:last-child {
  height: inherit;
  text-align: left;
}
.date {
  color: var(--red-dark);
}
.jobs-list__jobs-title {
  min-height: 88px;
}
.jobs-list__jobs-title a {
  color: var(--gray-800);
  font-weight: 560;
}
.jobs-list {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.jobs-list__search {
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

.jobs-list__filters__legend {
  flex-basis: 50%;

  legend {
    margin: 0;
    line-height: 2;
    font-size: $font-size-base;
    color: $gray-700;
  }
}

.jobs-list__input--search {
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

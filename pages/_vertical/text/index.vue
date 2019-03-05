<template>
  <div>
    <CardDeck
      title=""
      class="pt-5 pb-3"
      cardtype="TextCard"
      cols="4"
      :cards="texts"
    />
    <b-container class="texts-list__filters filters">
      <b-row class="texts-list__filters-row">
        <b-col md="12">
          <b-form
            class="texts-list__search"
            @submit.stop.prevent="applyFilters"
          >
            <b-form-group>
              <div class="legend-selects">
                <div class="texts-list__filters__legend">
                  <legend>Filter by</legend>
                </div>
              </div>
              <div class="texts-list__input--search">
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
    <b-container class="texts-list tabular-list">
      <b-row class="tabular-list__row tabular-list__header">
        <b-col
          md="3">
          Date
        </b-col>
        <b-col md="6">
          Title
        </b-col>
        <b-col md="3">
          Type
        </b-col>
      </b-row>
      <b-row
        v-for="text in results"
        class="tabular-list__row texts-list__texts"
        :key="text.title"
      >
        <b-col
          class="date"
          md="3"
        >
          {{ text.field_date_published }}
        </b-col>
        <b-col
          class="texts-list__texts-title"
          md="6">
          <a
            :href="text.view_node"
            v-html="text.title"
          />
        </b-col>
        <b-col md="3">
          {{ text.field_texttype }}
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
              :href="`/poetsorg/text?page=${Prev}${preparedCombine}`"
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
              :href="`/poetsorg/text?page=${pageNum + 1}{preparedCombine}`"
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
              :href="`/poetsorg/text?page=${pageNum + 2}${preparedCombine}`"
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
              :href="`/poetsorg/text?page=${pageNum + 3}${preparedCombine}`"
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
              :href="`/poetsorg/text?page=${totalPages - 1}${preparedCombine}`"
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
              :href="`/poetsorg/text?page=${Next}${preparedCombine}`"
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
import CardDeck from "~/components/CardDeck";

export default {
  components: {
    iconMediaSkipBackwards,
    iconMediaSkipForwards,
    iconSearch,
    CardDeck
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
    app.$buildBasicPage(app, store, "/texts");
    const url = "/api/texts_list";
    const mySearchHelpers = await searchHelpers.getSearchResults(
      url,
      app,
      query
    );

    let texts = await app.$axios
      .get("/api/texts", {})
      .then(res => {
        return {
          rows: res.data.rows,
          textsLink: {
            to: "/poetsorg/text",
            text: res.data.pager.total_items
          }
        };
      })
      .catch(err => {
        console.log(err);
      });

    return {
      combinedInput: mySearchHelpers.combinedInput,
      results: mySearchHelpers.results,
      Next: mySearchHelpers.Next,
      Prev: mySearchHelpers.Prev,
      preparedComgine: mySearchHelpers.preparedCombine,
      texts: texts.rows
    };
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
.texts-list__texts {
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
.texts-list__texts-title {
  min-height: 88px;
}
.texts-list__texts-title a {
  color: var(--gray-800);
  font-weight: 560;
}
.texts-list {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.texts-list__search {
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

.texts-list__filters__legend {
  flex-basis: 50%;

  legend {
    margin: 0;
    line-height: 2;
    font-size: $font-size-base;
    color: $gray-700;
  }
}

.texts-list__input--search {
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

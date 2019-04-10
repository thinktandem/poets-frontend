<template>
  <div>
    <CardDeck
      v-if="featuredPoems"
      col-size="md"
      class="bg-primary py-5"
      title="Featured Poems"
      cardtype="PoemCard"
      :cards="featuredPoems"/>
    <b-container class="poems-list__filters filters">
      <b-row class="poems-list__filters-row">
        <b-col md="12">
          <app-form
            class="poems-list__search"
            @submit.stop.prevent="applyFilters"
          >
            <b-form-group>
              <div class="legend-selects">
                <div class="poems-list__filters__legend">
                  <legend>Filter by</legend>
                </div>
                <b-form-select
                  inline
                  v-model="occasionsInput"
                  :options="$store.state.occasions"
                >
                  <option :value="null">Occasions</option>
                </b-form-select>
                <b-form-select
                  inline
                  v-model="themesInput"
                  :options="$store.state.themes"
                >
                  <option :value="null">Themes</option>
                </b-form-select>
                <b-form-select
                  inline
                  v-model="formInput"
                  :options="$store.state.form"
                >
                  <option :value="null">Forms</option>
                </b-form-select>
                <div class="poems-list__input--search">
                  <b-input-group>
                    <b-form-input
                      v-model="combinedInput"
                      type="text"
                      size="22"
                      placeholder="Search title or text ..."
                    />
                    <b-input-group-append
                      is-text
                      @click.stop.prevent="applyFilters"
                    >
                      <magnifying-glass-icon
                        class="icon mr-2"/>
                    </b-input-group-append>
                  </b-input-group>
                </div>
              </div>
            </b-form-group>
          </app-form>
        </b-col>
      </b-row>
    </b-container>
    <b-container class="poems-list tabular-list">
      <b-row class="tabular-list__row tabular-list__header">
        <b-col md="4">
          Name
        </b-col>
        <b-col md="4">
          Author
        </b-col>
        <b-col md="4">
          Year
        </b-col>
      </b-row>
      <b-row
        v-for="poem in results"
        class="tabular-list__row poems-list__poems"
        :key="poem.id"
      >
        <b-col md="4">
          <a
            :href="poem.view_node"
            v-html="poem.title"
          />
        </b-col>
        <b-col
          md="4"
          v-html="poem.field_author"/>
        <b-col md="4">
          {{ poem.field_date_published }}
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
              :href="`/poems?page=${Prev}${preparedCombine}`"
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
              :href="`/poems?page=${pageNum + 1}{preparedCombine}`"
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
              :href="`/poems?page=${pageNum + 2}${preparedCombine}`"
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
              :href="`/poems?page=${pageNum + 3}${preparedCombine}`"
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
              :href="`/poems?page=${totalPages - 1}${preparedCombine}`"
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
              :href="`/poems?page=${Next}${preparedCombine}`"
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
import _ from "lodash";
import qs from "qs";
import CardDeck from "~/components/CardDeck";
import searchHelpers from "~/plugins/search-helpers";
import filterHelpers from "~/plugins/filter-helpers";
import iconMediaSkipBackwards from "~/static/icons/media-skip-backwards.svg";
import iconMediaSkipForwards from "~/static/icons/media-skip-forwards.svg";
import MagnifyingGlassIcon from "~/node_modules/open-iconic/svg/magnifying-glass.svg";
import MetaTags from "~/plugins/metatags";

export default {
  components: {
    CardDeck,
    iconMediaSkipBackwards,
    iconMediaSkipForwards,
    MagnifyingGlassIcon
  },
  head() {
    return MetaTags.renderTags(this.$store.state.metatags);
  },
  data() {
    return {
      occasionsInput: null,
      themesInput: null,
      formInput: null,
      combinedInput: null,
      results: null,
      currentPage: null,
      totalPages: null,
      pageNum: null,
      Next: null,
      Prev: null,
      preparedThemes: null,
      preparedForm: null,
      preparedCombine: null
    };
  },
  async asyncData({ app, params, query, route }) {
    const url = "/api/poems";
    const msh = await searchHelpers.getSearchResults(url, app, query);

    const featuredPoemsParams = qs.stringify({
      page: {
        limit: 3
      },
      filter: {
        status: 1
      },
      sort: "-field_featured"
    });
    const featuredPoems = await app.$axios.$get(
      `/api/node/poems?${featuredPoemsParams}&include=field_author`
    );
    return {
      occasionsInput: msh.occasionsInput,
      themesInput: msh.themesInput,
      searchInput: msh.searchInput,
      results: msh.results,
      currentPaage: msh.currentPage,
      totalPages: msh.totalPages,
      pageNum: msh.pageNum,
      Next: msh.Next,
      Prev: msh.Prev,
      preparedOccasions: msh.preparedOccasions,
      preparedThemes: msh.preparedThemes,
      preparedForm: msh.preparedForm,
      preparedCombine: msh.preparedCombine,
      featuredPoems: _.map(featuredPoems.data, poem => {
        const poemAuthorId = _.get(
          poem,
          "relationships.field_author.data[0].id"
        );
        let author = "";
        _.each(featuredPoems.included, (inc, i) => {
          if (inc.id === poemAuthorId) {
            author = inc.attributes.title;
          }
        });
        return {
          link: poem.attributes.path.alias,
          title: poem.attributes.title,
          text: poem.attributes.body.processed,
          year: poem.attributes.field_copyright_date.split("-")[0],
          poet: {
            name: author
          }
        };
      })
    };
  },
  async fetch({ app, store, route }) {
    return app.$buildBasicPage(app, store, route.path).then(async () => {});
  },
  methods: {
    applyFilters() {
      let myQuery = {};
      if (this.combinedInput) {
        myQuery.combine = this.combinedInput;
      }
      if (this.themesInput) {
        myQuery.field_poem_themes_target_id = this.themesInput;
      }
      if (this.occasionsInput) {
        myQuery.field_occasion_target_id = this.occasionsInput;
      }
      if (this.formInput) {
        myQuery.field_form_target_id = this.formInput;
      }
      this.$router.push({
        name: "poems",
        query: myQuery
      });
    }
  },
  async fetch({ app, store, query, route }) {
    app.$buildBasicPage(app, store, "/poems");
    const occasions = await filterHelpers.getFilterOptions(
      app,
      "/api/taxonomy_term/occasions",
      "'fields[taxonomy_term--occasions]': 'drupal_internal__tid,name",
      "taxonomy"
    );
    const themes = await filterHelpers.getFilterOptions(
      app,
      "/api/taxonomy_term/themes",
      "'fields[taxonomy_term--themes]': 'drupal_internal__tid,name",
      "taxonomy"
    );
    const forms = await filterHelpers.getFilterOptions(
      app,
      "/api/taxonomy_term/form",
      "'fields[taxonomy_term--form]': 'drupal_internal__tid,name",
      "taxonomy"
    );
    store.commit("updateForm", forms.options);
    store.commit("updateOccasions", occasions.options);
    store.commit("updateThemes", themes.options);
  },
  watchQuery: true
};
</script>

<style scoped lang="scss">
.poems-list__poems {
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

.poems-list {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.poems-list__search {
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

.poems-list__filters__legend {
  flex-basis: 50%;

  legend {
    margin: 0;
    line-height: 2;
    font-size: $font-size-base;
    color: $gray-700;
  }
}

.poems-list__input--search {
  flex-basis: 100%;
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
.icon {
  display: inline;
  fill: $blue;
  width: 1.4rem;
  height: 1.4rem;
}
.input-group-text {
  background: transparent;
  border: none;
}
</style>

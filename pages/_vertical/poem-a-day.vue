<template>
  <div>
    <daily-poem
      :extended="true"
      :poem="$store.state.poemOfTheDay.poem"
      :poet="$store.state.poemOfTheDay.poet"/>
    <b-container class="poem-a-day__previous-poems tabular-list">
      <b-row>
        <h3 class="poem-a-day__previous-poems-title font-serif pb-3">
          Previous Poems
        </h3>
      </b-row>
      <b-row class="tabular-list__row tabular-list__header">
        <b-col md="2">
          Date
        </b-col>
        <b-col md="6">
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
        <b-col
          md="2"
          class="date"
        >
          {{ poem.field_poem_of_the_day_date }}
        </b-col>
        <b-col
          md="6"
          class="poem-title"
        >
          <a
            v-html="poem.title"
            :href="poem.view_node"/>
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
import DailyPoem from "~/components/Poems/DailyPoem";
import AppPoems from "~/components/AppPoemADayPoems/AppPoems";
import searchHelpers from "~/plugins/search-helpers";
import iconMediaSkipBackwards from "~/static/icons/media-skip-backwards.svg";
import iconMediaSkipForwards from "~/static/icons/media-skip-forwards.svg";
import SignupBlock from "~/components/SignupBlock";
import * as _ from "lodash";
import AppTable from "../../components/AppTable";

export default {
  components: {
    AppTable,
    DailyPoem,
    AppPoems,
    iconMediaSkipBackwards,
    iconMediaSkipForwards,
    SignupBlock
  },
  data() {
    return {
      results: null,
      // fields: [
      //   {
      //     key: "date",
      //     label: "date",
      //     sortable: true,
      //     sortDirection: "desc",
      //     tdClass: "text-secondary previous-poems__date"
      //   },
      //   {
      //     key: "title",
      //     label: "title",
      //     tdClass: "font-serif previous-poems__title"
      //   },
      //   {
      //     key: "poet",
      //     label: "poet",
      //     tdClass: "previous-poems__poet"
      //   }
      // ],
      Prev: null,
      Next: null
    };
  },
  async asyncData({ app, params, query }) {
    const url = "/api/previous-poems";
    return searchHelpers.getSearchResults(url, app, query);
    // .then(response => {
    //  return Object.assign(response, {
    //    results: _.map(response.results, result => {
    //      return {
    //        date: result.field_poem_of_the_day_date,
    //        title: result.title,
    //        poet: result.field_author
    //      };
    //    })
    //  });
    //  });
  },
  async fetch({ app, store, params }) {
    // Fetch all poems with poem a day date somewhere today.
    const response = await app.$axios.$get("/poem-a-day", {
      params: {
        _format: "json"
      }
    });
    const theOne = _.first(response);
    store.commit("updatePoemOfTheDay", {
      poet: {
        name: theOne.poet.name,
        image: theOne.poet.image ? theOne.poet.image : "",
        alias: theOne.poet.alias
      },
      poem: {
        attribution: theOne.poem.attribution,
        title: theOne.poem.title,
        text: theOne.poem.text,
        soundCloud: theOne.poem.soundcloud,
        alias: theOne.poem.alias,
        about: _.get(theOne, "poem.about")
      }
    });
    // Set the current hero
    store.commit("updateHero", {
      variant: "quote",
      lead:
        "Poetry offers us the capacity to carry in us and express the contradictory impulses that make us human.",
      subtext: "—Kwame Dawes, Academy of American Poets Chancellor (2018- )"
    });
  }
};
</script>

<style scoped lang="scss">
.poem-a-day__previous-poems {
  padding-top: $spacer * 5;
  h3 {
    font-size: 1.9rem;
    line-height: 1.9rem;
  }
  .tabular-list__header {
    background-color: #f2f8fa;
    text-transform: uppercase;
    font-weight: 560;
  }
  .date {
    color: var(--red-dark);
  }
  .poem-title a {
    color: var(--gray-800);
  }
}
</style>

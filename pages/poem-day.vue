<template>
  <div>
    <daily-poem
      :extended="true"
      :poem="$store.state.poemOfTheDay.poem"
      :poet="$store.state.poemOfTheDay.poet"/>
    <b-container class="poem-day__previous-poems tabular-list">
      <b-row>
        <h3 class="poem-day__previous-poems-title font-serif pb-3">
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
        v-for="(poem, i) in poems"
        :key="`poem-${i}`"
        class="tabular-list__row">
        <b-col
          md="2"
          class="date">
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
        <b-pagination
          @input="paginate"
          :disabled="busy"
          aria-controls="poems"
          class="pagination"
          hide-goto-end-buttons
          :per-page="perPage"
          size="lg"
          :total-rows="rows"
          v-model="page"
          align="fill">
          <span slot="prev-text">
            <iconMediaSkipBackwards /> Prev
          </span>
          <span slot="next-text">
            Next <iconMediaSkipForwards />
          </span>
        </b-pagination>
      </div>
    </b-container>
  </div>
</template>

<script>
import DailyPoem from "~/components/Poems/DailyPoem";
import AppPoems from "~/components/AppPoemADayPoems/AppPoems";
import iconMediaSkipBackwards from "~/static/icons/media-skip-backwards.svg";
import iconMediaSkipForwards from "~/static/icons/media-skip-forwards.svg";
import SignupBlock from "~/components/SignupBlock";
import * as _ from "lodash";
import AppTable from "~/components/AppTable";

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
      busy: true,
      page: 1,
      pageCache: [],
      perPage: 20,
      poems: [],
      rows: 0
    };
  },
  mounted() {
    // Get all the data we need for search
    Promise.all([this.searchPoems()]);
  },
  methods: {
    searchPoems(page = 0) {
      this.busy = true;
      this.$api.searchPreviousPoemsADay({ query: { page } }).then(response => {
        this.poems = _.get(response, "data.rows", []);
        this.page = _.get(response, "data.pager.current_page", 1) + 1;
        this.rows = _.get(response, "data.pager.total_items", 0);
        this.busy = false;
      });
    },
    paginate() {
      this.busy = true;
      // @NOTE: drupal starts at page 0, bPagination starts at 1
      // https://en.wikipedia.org/wiki/Off-by-one_error
      const queryPage = this.page - 1;
      this.searchPoems(queryPage);
    }
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
        id: _.get(theOne, "poem.uuid"),
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
.poem-day__previous-poems {
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

<template>
  <div>
    <daily-poem
      :extended="true"
      :poem="$store.state.poemOfTheDay.poem"
      :poet="$store.state.poemOfTheDay.poet"/>
    <b-container>
      <b-row>
        <h3 class="font-serif pb-3">
          Previous Poems
        </h3>
      </b-row>
      <b-table
        id="poems"
        :items="poems"
        :fields="fields"
        stacked="md"
        :per-page="perPage"
        sort-by="field_poem_of_the_day_date"
        :sort-desc="true">
        <template
          slot="title"
          slot-scope="data">
          <a
            :href="data.item.view_node"
            v-html="data.item.title"/>
        </template>
      </b-table>
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
      fields: [
        {
          key: "title",
          label: "Title"
        },
        {
          key: "field_author",
          label: "Author"
        },
        {
          key: "field_poem_of_the_day_date",
          label: "Date"
        }
      ],
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
        // Order past poem of days descending date.
        if (this.poems.length > 0) {
          this.poems = _.orderBy(
            this.poems,
            ["field_poem_of_the_day_date"],
            ["desc"]
          );
        }
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
    app.$api
      .getPoemADay()
      .then(response => _.get(response, "data[0]", []))
      .then(pad => {
        store.commit("updatePoemOfTheDay", {
          poet: {
            name: pad.poet.name,
            image: pad.poet.image ? pad.poet.image : "",
            alias: pad.poet.alias
          },
          poem: {
            title: pad.poem.title,
            text: pad.poem.text,
            soundCloud: pad.poem.soundcloud,
            alias: pad.poem.alias,
            id: _.get(pad, "poem.uuid", null),
            about: _.get(pad, "poem.about", null)
          }
        });
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
</style>

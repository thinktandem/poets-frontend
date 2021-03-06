<template>
  <div>
    <daily-poem
      :about="replaceFileUrl(body)"
      :extended="true"
      :poem="pad.poem"
      :poet="pad.poet"/>
    <b-container class="py-5">
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
            v-html="replaceFileUrl(data.item.title)"/>
        </template>
        <template
          slot="field_author"
          slot-scope="data">
          <a
            v-html="data.item.field_author"/>
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
import MetaTags from "~/plugins/metatags";

export default {
  components: {
    AppTable,
    DailyPoem,
    AppPoems,
    iconMediaSkipBackwards,
    iconMediaSkipForwards,
    SignupBlock
  },
  head() {
    return MetaTags.renderTags(this.$route, this.$store.state.metatags);
  },
  data() {
    return {
      busy: true,
      body: _.get(this.$store.state.pageData, "data.attributes.body.processed"),
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
      pad: {
        poem: {},
        poet: {
          image: ""
        }
      },
      page: 1,
      pageCache: [],
      perPage: 20,
      poems: [],
      rows: 0
    };
  },
  mounted() {
    // Get the PAD
    this.$api
      .getPoemADay()
      .then(response => _.get(response, "data[0]", []))
      .then(pad => {
        this.pad = {
          poet: {
            name: _.get(pad, "poet.name"),
            image: _.get(pad, "poet.image"),
            alias: _.get(pad, "poet.alias")
          },
          poem: {
            title: _.get(pad, "poem.title"),
            text: _.get(pad, "poem.text"),
            soundCloud: _.get(pad, "poem.soundcloud"),
            alias: _.get(pad, "poem.alias"),
            id: _.get(pad, "poem.uuid", null),
            about: _.get(pad, "poem.about", null)
          }
        };
      });
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
  async fetch({ app, store, route }) {
    return app.$buildBasicPage(app, store, route.path);
  }
};
</script>

<style scoped lang="scss">
</style>

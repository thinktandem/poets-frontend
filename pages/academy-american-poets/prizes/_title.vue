<template>
  <div>
    <b-container class="py-5">
      <b-row>
        <b-col xl="12">
          <h1>{{ prize.title }}</h1>
        </b-col>
      </b-row>
      <b-row>
        <b-col
          v-html="replaceFileUrl(prize.body)"
          class="prizes__body"
          md="8"/>
        <b-col md="4">
          <b-img-lazy
            :src="prize.image.src"
            :alt="prize.image.alt"
            fluid
            center/>
        </b-col>
      </b-row>
    </b-container>
    <b-container class="table-container">
      <b-table
        id="sub_prize_or_program"
        :items="subPrizes"
        :fields="fields"
        stacked="md"
        :per-page="perPage"
      >
        <template
          slot="title"
          slot-scope="data"
        >
          <a :href="data.item.winningLink">
            {{ data.item.title }}
          </a>
        </template>
        <template
          slot="field_author"
          slot-scope="data"
        >
          <a :href="data.item.winnerLink">
            {{ data.item.name }}
          </a>
        </template>
        <template
          slot="field_year"
          slot-scope="data"
        >
          {{ data.item.date }}
        </template>
      </b-table>
      <div class="pager">
        <b-pagination
          @input="paginate"
          :disabled="busy"
          aria-controls="books"
          class="pagination"
          hide-goto-end-buttons
          :per-page="perPage"
          size="lg"
          :total-rows="rows"
          v-model="page"
          align="fill"
        >
          <span slot="prev-text">
            <iconMediaSkipBackwards /> Prev
          </span>
          <span slot="next-text">
            Next
            <iconMediaSkipForwards />
          </span>
        </b-pagination>
      </div>
    </b-container>
  </div>
</template>

<script>
import _ from "lodash";
import MetaTags from "~/plugins/metatags";

export default {
  head() {
    return MetaTags.renderTags(this.$route, this.prize.tags);
  },
  data() {
    return {
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
          key: "field_year",
          label: "Year"
        }
      ]
    };
  },
  async asyncData({ app, route }) {
    const routerResponse = await app.$axios
      .$get(`/router/translate-path?path=${route.path}`)
      .catch(err => {
        app.handleError(err);
      });
    const prize = await app.$axios.$get(
      routerResponse.jsonapi.individual + "?include=field_image"
    );

    const subPrize = await app.$axios.$get(
      `/api/node/sub_prize_or_program?filter[field_parent.id]=${
        prize.data.id
      }&include=field_winner&sort=-field_year`
    );

    return {
      subPrizes: _.map(subPrize.data, item => {
        const winner = _.find(
          subPrize.included,
          include =>
            _.get(include, "id") ===
            _.get(_.first(_.get(item, "relationships.field_winner.data")), "id")
        );
        return {
          title: _.get(item, "attributes.title"),
          date: _.get(item, "attributes.field_year").split("-")[0],
          winningLink: _.get(item, "attributes.path.alias"),
          name: _.get(winner, "attributes.title"),
          winnerLink: _.get(winner, "attributes.path.alias")
        };
      }),
      prize: {
        title: _.get(prize, "data.attributes.title"),
        body: _.get(prize, "data.attributes.body.processed"),
        image: app.$buildImg(prize, null, "field_image", "media_aside_lg"),
        tags: _.get(prize, "data.attributes.metatag_normalized")
      }
    };
  },
  async fetch({ store }) {
    store.commit("updateHero", {
      heading: "Prizes"
    });
  }
};
</script>

<style scoped lang="scss">
.prizes__body {
  font-weight: 400;
}
</style>

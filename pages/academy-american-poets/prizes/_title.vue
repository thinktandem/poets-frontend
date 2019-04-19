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

    <b-container class="prizes-list tabular-list">
      <b-row class="tabular-list__row tabular-list__header">
        <b-col
          md="2">
          Year
        </b-col>
        <b-col md="3">
          Poet
        </b-col>
        <b-col md="7">
          Title
        </b-col>
      </b-row>
      <b-row
        v-for="(subPrize, index) in subPrizes"
        class="tabular-list__row prizes-list__books"
        :key="index"
      >
        <b-col
          class="date"
          md="2"
        >
          {{ subPrize.date }}
        </b-col>
        <b-col
          class="books-list__books-title"
          md="3">
          <b-link
            :to="subPrize.winnerLink"
            class="text-dark">
            {{ subPrize.name }}
        </b-link></b-col>
        <b-col md="7">
          <b-link
            :to="subPrize.winningLink"
            class="text-dark">
            {{ subPrize.title }}
          </b-link>
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
              :href="`/prizes?page=${Prev}${preparedCombine}`"
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
              :href="`/prizes?page=${pageNum + 1}{preparedCombine}`"
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
              :href="`/prizes?page=${pageNum + 2}${preparedCombine}`"
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
              :href="`/prizes?page=${pageNum + 3}${preparedCombine}`"
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
              :href="`/prizes?page=${totalPages - 1}${preparedCombine}`"
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
              :href="`/prizes?page=${Next}${preparedCombine}`"
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
import MetaTags from "~/plugins/metatags";

export default {
  head() {
    return MetaTags.renderTags(this.prize.tags);
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
      }&include=field_winner&sort=-created`
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
          date: _.get(item, "attributes.created").split("-")[0],
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
.book__body {
  font-weight: 400;
  font-size: 1.2em;
}
</style>

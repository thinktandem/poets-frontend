<template>
  <div>
    <b-container class="poems-list__filters filters">
      <b-row class="poems-list__filters-row">
        <b-col md="12">
          tweets ...
          <br>
          {{ tweets }}
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Twitter from "twitter-node-client";

export default {
  components: {},
  data() {
    return {
      tweets: null
    };
  },
  async asyncData({ app, params, query }) {
    const twitter = new Twitter();
    const tweets = twitter.getUserTimeline(
      {
        screen_name: "poets.org",
        count: "4"
      },
      error,
      success
    );
    return tweets;
  },
  methods: {},
  watchQuery: true
};
</script>

<style scoped lang="scss">
</style>

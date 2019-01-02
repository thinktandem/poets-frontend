<template>
  <div>
    <b-container class="npm__container">
      <b-row>
        <b-col md="12">
          Twitter :: Poets.org
        </b-col>
      </b-row>
      <b-row class="npm__tweets-row">
        <b-col
          v-for="tweet in tweets"
          :key="`--${tweet}`"
          md="3"
          class="npm__tweets-col"
        >
          <div class="npm__tweets-col-date">
            <a :href="tweet.created_at">
              {{ tweet.created_at }}
            </a>
          </div>
          <div class="npm__tweets-col-text">
            {{ tweet.text }}
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      tweets: {}
    };
  },
  async asyncData({ app, params, query }) {
    const Twit = require("twit");
    const config = {
      consumer_key: "VD1mP2OGqooLrjxrHWBDQHUbo",
      consumer_secret: "IYnXGS44hYcqLG4RLm3gGL7yFlqz1t3BjWob4UW1Yyyb7OmtGx",
      access_token: "17496303-FpXOkS3TpEWIk9zqR2EmWkNEICWWm3Qn3Onjx8N4X",
      access_token_secret: "QnOByeSXPDSdOX7zT5E6JpydMCNldHr2IDDxrHFWAo0mx"
    };
    const T = new Twit(config);

    /*
     * To use promises API w/ T do not use a callback to T.get.
     *
     * https://api.twitter.com/1.1/statuses/user_timeline.json
     */
    return T.get("statuses/user_timeline", {
      screen_name: "POETSorg",
      count: 4
    }).then(res => {
      console.log(res.data);
      return {
        tweets: res.data
      };
    });
  },
  methods: {},
  watchQuery: true
};
</script>

<style scoped lang="scss">
.npm__tweets-col {
  font-weight: 400;
}
</style>

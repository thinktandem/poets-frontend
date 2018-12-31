<template>
  <div>
    <b-container class="poems-list__filters filters">
      <b-row class="poems-list__filters-row">
        <b-col md="12">
          tweets ...
          <br>
          {{ tweets }} .... gff is the best?
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
// import qs from "querystring";

export default {
  components: {},
  data() {
    return {
      tweets: {}
    };
  },
  asyncData({ app, params, query }) {
    const Twit = require("twit");
    const config = {
      consumer_key: "VD1mP2OGqooLrjxrHWBDQHUbo",
      consumer_secret: "IYnXGS44hYcqLG4RLm3gGL7yFlqz1t3BjWob4UW1Yyyb7OmtGx",
      access_token: "17496303-FpXOkS3TpEWIk9zqR2EmWkNEICWWm3Qn3Onjx8N4X",
      access_token_secret: "QnOByeSXPDSdOX7zT5E6JpydMCNldHr2IDDxrHFWAo0mx"
      // callBackUrl: "/national-poetry-month"
    };
    const T = new Twit(config);
    // https://api.twitter.com/1.1/statuses/user_timeline.json
    return T.get(
      "/statuses/user_timeline",
      { screen_name: "POETSorg", count: 4 },
      (err, data, newRes) => {
        console.log("\n\ngff----------------------\n\n\n", data[0]);
        return {
          tweets: data
        };
      }
    ).catch(err => {
      console.log(err);
    });
  },
  methods: {},
  watchQuery: true
};
</script>

<style scoped lang="scss">
</style>

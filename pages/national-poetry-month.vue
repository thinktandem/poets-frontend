<template>
  <div>
    <b-container class="npm__tweets-container">
      <b-row>
        <b-col
          md="12"
          class="npm__tweets-row-header"
        >
          <TwitterIcon/> <span class="poets-org">Poets.org</span>
        </b-col>
      </b-row>
      <b-row class="npm__tweets-row-tweets">
        <b-col
          v-for="tweet in tweets"
          :key="`--${tweet}`"
          md="3"
          class="npm__tweets-col"
        >
          <div class="npm__tweets-col-date">
            <a
              :href="`https://twitter.com/POETSorg/status/${tweet.id_str}`"
              target="_elBlanco"
            >
              {{ niceDate(tweet.created_at) }}
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
import TwitterIcon from "~/static/social/twitter-just-bird.svg";
import niceDate from "~/plugins/niceDate";

export default {
  components: {
    TwitterIcon
  },
  data() {
    return {
      tweets: {}
    };
  },
  async asyncData({ app, params, query }) {
    const Twit = require("twit");
    const config = {
      consumer_key: process.env.TWIT_CONSUMER_KEY,
      consumer_secret: process.env.TWIT_CONSUMER_SECRET,
      access_token: process.env.TWIT_ACCESS_TOKEN,
      access_token_secret: process.env.TWIT_TOKEN_SECRET
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
  methods: {
    niceDate(date) {
      return niceDate.niceDate(date);
    }
  },
  watchQuery: true
};
</script>

<style scoped lang="scss">
.npm__tweets-container {
  margin-top: 26px;
  margin-bottom: 32px;
}
.npm__tweets-row-header {
  margin-top: 8px;
  margin-bottom: 26px;
  font-size: 28px;
  svg {
    position: relative;
    top: 9px;
    margin-right: 7px;
  }
}
.npm__tweets-col {
  font-weight: 400;
  .npm__tweets-col-date {
    margin-bottom: 7px;
  }
  a {
    font-weight: 600;
  }
}
</style>

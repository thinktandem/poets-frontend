<template>
  <div>
    <basic-page
      :body="$store.state.pageData.data.attributes.body.processed"
      :highlighted="$store.state.highlightedData"
      :featured-content="$store.state.featuredContent"
      :more="$store.state.relatedContent"
      :sidebar-data="$store.state.sidebarData"/>
    <div class="npm__news-and-events">
      <b-container>
        <b-row>
          <b-col lg="6">
            <NpmEvents
              :events="events"
            />
          </b-col>
          <b-col lg="6">
            <NpmNews
              :news="news"
            />
          </b-col>
        </b-row>
      </b-container>
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
  </div>
</template>

<script>
import BasicPage from "~/components/BasicPage";
import NpmEvents from "~/components/Npm/NpmEvents";
import NpmNews from "~/components/Npm/NpmNews";
import TwitterIcon from "~/static/social/twitter-just-bird.svg";
import niceDate from "~/plugins/niceDate";

export default {
  components: {
    BasicPage,
    NpmEvents,
    NpmNews,
    TwitterIcon
  },
  data() {
    return {
      news: {},
      tweets: {}
    };
  },
  async fetch({ app, store }) {
    return app.$buildBasicPage(app, store, "/national-poetry-month");
  },
  async asyncData({ app, store, params, query }) {
    const events = await app.$axios
      .get("/api/npm_events", {})
      .then(res => {
        return res.data.rows;
      })
      .catch(err => {
        console.log(err);
      });
    const news = await app.$axios
      .get("/api/npm_news", {})
      .then(res => {
        return res.data.rows;
      })
      .catch(err => {
        console.log(err);
      });

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
    let tweets = await T.get("statuses/user_timeline", {
      screen_name: "POETSorg",
      count: 4
    }).then(res => {
      console.log(res.data);
      return res.data;
    });

    return {
      events,
      news,
      tweets
    };
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
.npm__news-and-events {
  margin-top: 64px;
}
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

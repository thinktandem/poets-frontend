<template>
  <div>
    <basic-page
      :page-data="$store.state.pageData"
      :highlighted="$store.state.highlightedData"
      :features="$store.state.featuredContent"
      :more="$store.state.relatedContent"
      :sidebar-data="$store.state.sidebarData"/>
    <div class="npm__news-and-events">
      <b-container>
        <b-row>
          <b-col lg="6">
            <h3 class="npm__heading font-serif">Upcoming Events</h3>
            <app-listing
              class="border-bottom"
              resource-type="events"
              :paged="false"
              :details="details"
              :default-params="defaultParams"
              :includes="includes"
              :filters="filters"
              :searchable="searchable"
              :fields="fields"/>
            <div class="p-3">
              <b-link
                class="more-link"
                to="/poetry-near-you">More Events <i class="fancy-chevron"/></b-link>
            </div>
          </b-col>
          <b-col lg="6">
            <h3 class="npm__heading font-serif">News & Updates</h3>
            <NpmNews
              :news="news"
            />
            <div class="p-3">
              <b-link
                class="more-link"
                to="/national-poetry-month/news-updates">More News & Updates <i class="fancy-chevron"/></b-link>
            </div>
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
            v-for="(tweet, index) in tweets"
            :key="index"
            md="3"
            class="npm__tweets-col"
          >
            <div class="npm__tweets-col-date">
              <a
                :href="`https://twitter.com/POETSorg/status/${tweet.id_str}`"
                target="_blank"
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
import AppListing from "~/components/AppListing";
import BasicPage from "~/components/BasicPage";
import NpmEvents from "~/components/Npm/NpmEvents";
import NpmNews from "~/components/Npm/NpmNews";
import TwitterIcon from "~/static/social/twitter-just-bird.svg";
import niceDate from "~/plugins/niceDate";
import MetaTags from "~/plugins/metatags";

export default {
  components: {
    AppListing,
    BasicPage,
    NpmEvents,
    NpmNews,
    TwitterIcon
  },
  head() {
    return MetaTags.renderTags(this.$store.state.metatags);
  },
  data() {
    return {
      news: {},
      tweets: {},
      details: {
        body: {},
        event_start_time: {},
        field_location: {},
        register_link: {}
      },
      includes: {},
      fields: {
        field_event_date: { label: "Date" },
        title: { label: "Name" },
        field_location: { label: "Location" }
      },
      defaultParams: { page: { limit: 8 } },
      filters: [],
      searchable: []
    };
  },
  async fetch({ app, store, route }) {
    return app.$buildBasicPage(app, store, route.path);
  },
  async asyncData({ app, store, params, query }) {
    const news = await app.$axios
      .get("/api/npm_news", {})
      .then(res => {
        return res.data.rows;
      })
      .catch(err => {
        console.log(err);
      });

    // Proxy call to our own API so we can get around twitter server-only limitation
    const tweets = await app
      .$axios({
        url: "tweets",
        baseURL: process.env.APP_URL
      })
      .then(res => res.data.tweets)
      .catch(e => console.log(e));
    return {
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
.npm__heading {
  font-style: italic;
  font-weight: 500;
  font-size: 2.625rem;
  line-height: 1.05;
  color: $indigo;
  padding-bottom: $spacer;
}
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
.more-link {
  font-size: 1.25rem;
  line-height: 2rem;
}
.fancy-chevron {
  @include chevron(0.7rem, 2px, 0px, $blue-dark);
}
</style>

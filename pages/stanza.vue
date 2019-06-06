<template>
  <div>
    <basic-page
      :page-data="$store.state.pageData"
      :extended-content="$store.state.extendedContent"
      :highlighted="$store.state.highlightedData"
      :more="$store.state.relatedContent"
      :sidebar-data="$store.state.sidebarData"/>
    <b-container>
      <b-row>
        <b-col>
          <app-media-list
            :items="currentItems"/>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-pagination
            align="center"
            :per-page="10"
            :hide-goto-end-buttons="true"
            @change="fetchNext"
            v-model="currentPage"
            :total-rows="stanzas.totalRows">
            <span slot="prev-text"><IconMediaSkipBackwards/> Prev</span>
            <span slot="next-text">Next <IconMediaSkipForwards/></span>
          </b-pagination>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import AppMediaList from "~/components/AppMediaList";
import BasicPage from "~/components/BasicPage";
import IconMediaSkipBackwards from "~/static/icons/media-skip-backwards.svg";
import IconMediaSkipForwards from "~/static/icons/media-skip-forwards.svg";
import MetaTags from "~/plugins/metatags";

// import qs from "qs";
import * as _ from "lodash";
export default {
  components: {
    AppMediaList,
    BasicPage,
    IconMediaSkipBackwards,
    IconMediaSkipForwards
  },
  head() {
    return MetaTags.renderTags(this.$route, this.$store.state.metatags);
  },
  data() {
    return {
      currentPage: 1,
      first: 0,
      last: 10
    };
  },
  async asyncData({ app }) {
    const stanzas = await app.$axios
      .$get("/api/node/basic_page", {
        params: {
          filter: {
            story_type: {
              path: "field_story_type.id",
              operator: "IN",
              value: [
                // press releases
                "30ea5489-2154-4579-96f8-a16ee6b581cf"
              ].join(",")
            }
          },
          include: "field_image",
          sort: "-changed",
          page: {
            limit: 20
          }
        }
      })
      .then(response => ({
        response,
        totalRows: parseInt(_.get(response, "meta.count")),
        items: _.map(response.data, item => ({
          date: _.get(item, "attributes.changed"),
          title: _.get(item, "attributes.title"),
          titleLink: _.get(item, "attributes.path.alias"),
          body:
            _.get(item, "attributes.body.summary") ||
            _.get(item, "attributes.body.processed"),
          img: app.$buildImg(response, item, "field_image", "media_aside_lg", {
            src: "/images/typewriter.jpg",
            alt: ""
          })
        }))
      }));
    return { stanzas };
  },
  async fetch({ app, store, route }) {
    return app.$buildBasicPage(app, store, route.path);
  },
  computed: {
    hasNext() {
      return _.get(this.stanzas.response, "links.next") !== undefined;
    },
    currentItems() {
      return this.stanzas.items.slice(this.first, this.last);
    }
  },
  methods: {
    async fetchNext(newPage) {
      return this.hasNext && newPage > this.currentPage
        ? this.$axios
            .$get(_.get(this.stanzas.response, "links.next.href"))
            .then(response => {
              this.first = this.currentPage * 10 - 10 + 1;
              this.last = this.first + 10;
              this.stanzas.response = response;
              this.stanzas.items = this.stanzas.items.concat(
                _.map(response.data, item => ({
                  date: _.get(item, "attributes.changed"),
                  title: _.get(item, "attributes.title"),
                  titleLink: _.get(item, "attributes.path.alias"),
                  body:
                    _.get(item, "attributes.body.summary") ||
                    _.get(item, "attributes.body.processed"),
                  img: this.$buildImg(
                    response,
                    item,
                    "field_image",
                    "media_aside_lg",
                    {
                      src: "/images/typewriter.jpg",
                      alt: ""
                    }
                  )
                }))
              );
            })
        : null;
    }
  }
};
</script>

<style scoped lang="scss">
</style>

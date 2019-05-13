<template>
  <div
    :class="{embed:embedded}">
    <b-container
      class="py-5">
      <b-row>
        <b-col xs="12">
          <div
            class="anthology"
            v-html="replaceFileUrl(body)"/>
        </b-col>
      </b-row>
      <b-row>
        <transition name="slide-fade">
          <b-col
            lg="6"
            class="pr-lg-0 options-drawer"
            :class="{closed: !optionsOpen}"
            v-show="optionsOpen">
            <div
              class="bg-dark text-white p-4 d-flex flex-column align-items-start">
              <b-button
                variant="outline-light"
                size="sm"
                @click="closeOptions"
                class="mb-3">read <chevron-right/></b-button>
              <span class="h3 font-serif">
                {{ $store.state.pageData.data.attributes.title }}
              </span>
              <b-list-group class="border-bottom border-white my-3">
                <b-list-group-item
                  class="d-flex flex-column bg-dark text-white border-top border-white py-3"
                  v-for="(poem, i) in $store.state.relatedContent"
                  :key="i">
                  <b-link
                    class="h4 text-white font-serif"
                    :to="poem.attributes.path.alias">
                    {{ poem.attributes.title }}</b-link>
                  <b-link
                    class="text-white"
                    :to="poem.author.attributes.path.alias">
                    {{ poem.author.attributes.title }}</b-link>
                </b-list-group-item>
              </b-list-group>
              <anthology-actions :anthology="actionPack"/>
            </div>
          </b-col>
        </transition>
        <b-col
          lg="6"
          class="shadow">
          <div class="p-2 p-md-4">
            <div
              class="pb-lg-4 d-flex flex-row justify-content-between">
              <div class="pb-3 pb-lg-0 mr-4">
                <b-button
                  v-show="!optionsOpen"
                  size="sm"
                  type="button"
                  variant="outline-primary-dark"
                  @click="openOptions"><chevron-left class="d-none d-md-inline"/> options</b-button>
              </div>
              <div class="d-flex flex-column align-items-end">
                <div>
                  <span class="text-indigo text-right">
                    {{ $store.state.pageData.data.attributes.title }}
                  </span>
                </div>
                <div>
                  <b-link
                    class="pr-2 pager-link"
                    :disabled="currentIndex === 0"
                    @click="previous"><chevron-left/> previous</b-link>
                  <b-link
                    class="pl-2 pager-link"
                    :disabled="currentIndex === $store.state.relatedContent.length - 1"
                    @click="next">next <chevron-right/></b-link>
                </div>
              </div>
            </div>
            <transition-group name="fade">
              <div
                v-show="currentIndex === i"
                v-for="(poem, i) in $store.state.relatedContent"
                :key="i"
                class="anthology__poem">
                <h3
                  class="font-serif py-2">
                  <b-link
                    class="text-dark"
                    target="_top"
                    :to="poem.attributes.path.alias">{{ poem.attributes.title }}</b-link>
                </h3>
                <div class="py-2">
                  <b-link
                    class="text-dark"
                    target="_top"
                    :to="poem.author.attributes.path.alias">{{ poem.author.attributes.title }}</b-link></div>
                <div
                  class="anthology__poem-body poem__body"
                  v-html="replaceFileUrl(poem.attributes.body.processed)"/>
              </div>
            </transition-group>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import _ from "lodash";
import ChevronLeft from "~/node_modules/open-iconic/svg/chevron-left.svg";
import ChevronRight from "~/node_modules/open-iconic/svg/chevron-right.svg";
import MetaTags from "~/plugins/metatags";
import niceDate from "~/plugins/niceDate";
import AnthologyActions from "~/components/AnthologyActions";

export default {
  layout({ route }) {
    return _.get(route.query, "mbd") === "1" ? "embed" : "default";
  },
  components: { ChevronLeft, ChevronRight, AnthologyActions },
  data() {
    return {
      body: "",
      currentIndex: 0,
      optionsOpen: false,
      included: {}
    };
  },
  head() {
    return MetaTags.renderTags(this.$store.state.metatags);
  },
  mounted() {
    this.body = _.get(
      this.$store.state.pageData,
      "data.attributes.body.processed"
    );
    this.related = this.$store.state.relatedContent;
  },
  async fetch({ app, store, route }) {
    return app.$axios
      .$get(`/router/translate-path?path=${route.path}`)
      .catch(err => {
        app.handleError(err);
      })
      .then(res => {
        return app.$axios
          .$get(res.jsonapi.individual + "?include=field_poems.field_author")
          .then(res => {
            store.commit("updateHero", {
              variant: "default",
              heading: _.get(res, "data.attributes.title"),
              lead: _.get(res, "data.attributes.lead_text")
            });
            // Set the main page data
            store.commit("updatePageData", res);
            store.commit("updateSidebarData", []);
            store.commit("updateHighlightedData", []);
            const metatags = res.data.attributes.metatag_normalized;
            store.commit("updateMetatags", metatags);
            const poems = _(res.included)
              // Only the poems (not authors)
              .filter(include => _.get(include, "type") === "node--poems")
              // Mix the authors in
              .map(poem =>
                _.merge(poem, {
                  author: app.$getRelated(res, poem, "field_author")
                })
              )
              .value();
            store.commit("updateRelatedContent", poems);
            return {
              props: {
                title: _.get(res, "attributes.title"),
                text: _.get(res, "attributes.body.summary"),
                link: _.get(res, "attributes.path.alias")
              }
            };
          })
          .catch(error => {
            console.error(error);
          });
        store.commit("updateFeaturedContent", []);
        store.commit("updateExtendedContent", []);
      })
      .catch(error => {
        console.error(error);
      });
  },
  computed: {
    // This can be used to later react to embedding and alter the style of the
    // page, see the poem component for similar usage.
    embedded() {
      return _.get(this.$route.query, "mbd") === "1";
    },
    actionPack() {
      return {
        title: this.$store.state.pageData.data.attributes.title,
        alias: this.$store.state.pageData.data.attributes.path.alias,
        id: this.$store.state.pageData.data.id
      };
    }
  },
  methods: {
    next() {
      this.currentIndex = this.currentIndex + 1;
    },
    niceDate(date, format) {
      return niceDate.niceDate(date, format);
    },
    previous() {
      this.currentIndex = this.currentIndex - 1;
    },
    closeOptions() {
      this.optionsOpen = false;
    },
    openOptions() {
      this.optionsOpen = true;
    }
  }
};
</script>
<style lang="scss" scoped>
a.disabled {
  color: var(--gray);
  svg {
    fill: var(--gray);
  }
}
.fill-blue {
  fill: var(--blue-dark);
}
.btn-outline-primary-dark {
  svg {
    fill: var(--blue-dark);
  }
  &:hover {
    svg {
      fill: var(--white);
    }
  }
}
.btn-outline-light {
  svg {
    fill: var(--light);
  }
  &:hover {
    svg {
      fill: var(--dark);
    }
  }
}
.anthology {
  font-weight: 400;
}
.anthology__poem-body {
  font-weight: 400;
}
.anthology__poems-list {
  margin-bottom: 22px;
}
.anthology__list-header {
  background-color: #f2f8fa;
  text-transform: uppercase;
  font-weight: 560;
  padding: 11px 0 11px 0;
}
.anthology__poem-list-item {
  padding: 8px 0 8px 0;
  border-bottom: 1px solid var(--gray-600);
}
.option-drawer {
  overflow-y: scroll;
  max-height: 100;
  &.closed {
    margin-left: -1000px;
    opacity: 0;
  }
}
.pager-link {
  font-weight: 600;
  color: $black;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.slide-fade-enter-active {
  transition: all 0.2s ease;
}
.slide-fade-leave-active {
  transition: all 0.2s ease;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(-1000px);
  opacity: 0;
}
.embed {
  max-height: 750px;
  overflow-y: scroll;
}
</style>

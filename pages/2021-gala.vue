<template>
  <b-container>
    <b-row class="basic_page__body">
      <b-col
        class="pb-2 basic_page__main">
        <div
          v-if="!empty(body)"
          v-html="replaceFileUrl(body.processed)"
          class="pb-4" />
      </b-col>
      <b-col
        v-if="!empty(sidebarData)"
        md="4"
        class="basic_page__sidebar pb-2" >
        <component
          v-for="(item, index) in sidebarData"
          :key="index"
          :is="item.component"
          v-bind="item.props"/>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import MetaTags from "~/plugins/metatags";
import * as _ from "lodash";
import ButtonBlock from "~/components/ButtonBlock";
import CalloutCard from "~/components/CalloutCard";
import CardDeck from "~/components/CardDeck";
import FeatureStack from "~/components/FeatureStack";
import LessonPlanCard from "~/components/LessonPlanCard";
import ResourceCard from "~/components/ResourceCard";
import VideoBlock from "~/components/VideoBlock";
import SignupBlock from "~/components/SignupBlock";
import ImageBlock from "~/components/ImageBlock";
import SidebarTextImage from "~/components/SidebarTextImage";
import SlideshowBlock from "~/components/SlideshowBlock";
import StandardTextBlock from "~/components/StandardTextBlock";
import StatesJumpListBlock from "~/components/StatesJumpListBlock";
export default {
  layout: "sparse",
  components: {
    ButtonBlock,
    CalloutCard,
    CardDeck,
    FeatureStack,
    ImageBlock,
    LessonPlanCard,
    ResourceCard,
    SignupBlock,
    SidebarTextImage,
    SlideshowBlock,
    StandardTextBlock,
    VideoBlock,
    StatesJumpListBlock
  },
  props: {
    pageData: {
      type: Object,
      default: null
    }
  },
  head() {
    return MetaTags.renderTags(this.$route, this.$store.state.metatags);
  },
  computed: {
    body() {
      return _.get(this.$store, "state.pageData.data.attributes.body");
    },
    sidebarData() {
      return _.get(this.$store, "state.sidebarData");
    }
  },
  async fetch({ app, store, params, route, menu }) {
    return app.$buildBasicPage(app, store, route.path);
  }
};
</script>

<style lang="scss" scoped>
.basic_page__body {
  font-size: 1.25rem;
  font-weight: 400;
  .basic_page__main {
    div:first-child {
      margin-top: 3.6rem;
    }
  }
}

.basic_page__sidebar {
  div:first-child {
    margin-top: 3.6rem;
    margin-bottom: $spacer * 2;
  }
  div:last-child:not(:first-child) {
    margin-top: $spacer * 2;
    margin-bottom: 0;
  }
  div:not(:first-child):not(:last-child) {
    margin-top: $spacer * 2;
    margin-bottom: $spacer * 2;
  }
}
</style>

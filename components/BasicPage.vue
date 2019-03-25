<template>
  <div>
    <b-container>
      <b-row class="basic_page__body">
        <b-col
          md="8"
          class="pb-2 basic_page__main">
          <div
            v-if="!empty(body)"
            v-html="body.processed"
            class="pb-4"/>
          <card-deck
            v-if="!empty(highlighted)"
            class="pt-3 pb-1"
            :cards="highlighted"
            cardtype="CalloutCard"
            cols="6"/>
          <callout-card
            v-if="hasCta"
            :img="callToAction.img"
            variant="bold"
            :teaser-length="callToAction.teaserLength"
            :text="callToAction.text"
            :title="callToAction.title"
            :action="callToAction.action"/>
          <card-deck
            v-if="!empty(more)"
            cols="6"
            class="pt-5"
            :cardtype="more.cardType"
            :title="more.title"
            :link="more.link"
            :cards="more.cards"/>
        </b-col>
        <b-col
          v-if="sidebarData.length >= 1"
          md="4"
          class="basic_page__sidebar pb-2">
          <component
            v-if="!empty(sidebarData)"
            v-for="(item, index) in sidebarData"
            :key="index"
            :is="item.component"
            v-bind="item.props"/>
        </b-col>
      </b-row>
    </b-container>
    <feature-stack
      v-if="!empty(features)"
      title="Featured"
      :features="features"/>
    <component
      v-if="!empty(extendedContent)"
      class="py-3"
      v-for="(item, index) in extendedContent"
      :key="index"
      :is="item.component"
      v-bind="item.props"/>
  </div>
</template>

<script>
import _ from "lodash";
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

export default {
  name: "BasicPage",
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
    VideoBlock
  },
  props: {
    pageData: {
      type: Object,
      default: null
    },
    extendedContent: {
      type: Array,
      default: null
    },
    highlighted: {
      type: Array,
      default: null
    },
    callToAction: {
      type: Object,
      default: null
    },
    more: {
      type: Object,
      default: null
    },
    sidebarData: {
      type: Array,
      default: null
    },
    features: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  computed: {
    body() {
      return _.get(this.pageData, "data.attributes.body");
    },
    hasCta() {
      return !_.isEmpty(this.callToAction);
    }
  },
  methods: {
    empty(field) {
      return _.isEmpty(field) || field === null || field === undefined;
    }
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

<template>
  <b-container class="py-5">
    <b-row class="basic_page__body">
      <b-col md="8">
        <div
          v-html="body"
          class="pb-4"/>
        <card-deck
          class="py-3"
          :cards="highlighted"
          cardtype="CalloutCard"
          cols="6"/>
        <callout-card
          v-if="callToAction !== null"
          :img="callToAction.img"
          variant="bold"
          :teaser-length="callToAction.teaserLength"
          :text="callToAction.text"
          :title="callToAction.title"
          :action="callToAction.action"/>
        <card-deck
          v-if="more !== null"
          cols="6"
          :cardtype="more.cardType"
          :title="more.title"
          :link="more.link"
          :cards="more.cards"/>
      </b-col>
      <b-col
        md="4"
        class="basic_page__sidebar">
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
import CalloutCard from "~/components/CalloutCard";
import CardDeck from "~/components/CardDeck";
import ResourceCard from "~/components/ResourceCard";
import VideoBlock from "~/components/VideoBlock";
import SignupBlock from "~/components/SignupBlock";
export default {
  name: "BasicPage",
  components: {
    CalloutCard,
    CardDeck,
    ResourceCard,
    SignupBlock,
    VideoBlock
  },
  props: {
    body: {
      type: String,
      default: ""
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
    }
  }
};
</script>

<style scoped lang="scss">
.basic_page__body {
  font-size: 1.25rem;
  font-weight: 400;
}

.basic_page__sidebar {
  div:first-child {
    margin-top: 0;
    margin-bottom: $spacer * 2;
  }
  div:last-child {
    margin-top: $spacer * 2;
    margin-bottom: 0;
  }
  div:not(:first-child):not(:last-child) {
    margin-top: $spacer * 2;
    margin-bottom: $spacer * 2;
  }
}
</style>

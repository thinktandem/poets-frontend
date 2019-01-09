<template>
  <div class="py-3">
    <div class="media-list__header pb-3 d-flex flex-row justify-content-between align-items-center">
      <component
        :is="titleTag"
        v-if="null !== title"
        class="font-serif media-list__title">{{ title }}</component>
      <b-link :to="moreLink.to">{{ moreLink.text }} <chevron-right class="chevron"/></b-link>
    </div>
    <ul class="list-unstyled">
      <app-media
        v-for="(program, index) in programs.slice(0, 3)"
        :key="index"
        tag="li"
        :img-id="program.imgId"
        :title="program.title"
        :title-link="program.titleLink"
        :body="program.body"
        :img="program.img"/>
    </ul>
  </div>
</template>

<script>
import AppMedia from "~/components/AppMedia";
import ChevronRight from "~/node_modules/open-iconic/svg/chevron-right.svg";

export default {
  name: "AppMediaList",
  components: {
    AppMedia,
    ChevronRight
  },
  props: {
    programs: {
      type: Array,
      default() {
        return [];
      }
    },
    moreLink: {
      type: Object,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    titleTag: {
      type: String,
      default: "h3"
    }
  }
};
</script>

<style scoped lang="scss">
.chevron {
  height: 10px;
  width: 10px;
  fill: $blue-light;
}
.media-list__header {
  font-size: 1.25rem;
}
.media-list__title {
  font-size: 2.65rem;
  line-height: 2.75rem;
}
</style>

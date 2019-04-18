<template>
  <section class="sidebar-text-image">
    <b-container>
      <b-row>
        <b-col lg="8">
          <b-media
            no-body
            class="d-flex flex-column flex-md-row">
            <b-media-aside
              v-show="!empty(leftImg)"
              class="mr-3">
              <b-img-lazy
                fluid
                :src="leftImg.src"
                :alt="leftImg.alt"/>
            </b-media-aside>
            <b-media-body
              class="d-flex flex-column">
              <component
                class="title mt-2 mb-3"
                v-if="title"
                :is="titleTag">{{ title }}</component>
              <div
                class="pr-4 mb-3"
                v-show="body"
                v-html="body"/>
              <b-link
                class="more-link mt-auto mb-3"
                v-if="!empty(moreLink)"
                :to="moreLink.uri">{{ moreLink.title }} <i
                  class="fancy-chevron"/></b-link>
            </b-media-body>
          </b-media>
        </b-col>
        <b-col lg="4">
          <b-media-aside
            v-if="!empty(img)"
            class="mr-3">
            <b-img-lazy
              fluid
              :src="img.src"
              :alt="img.alt"/>
          </b-media-aside>
          <div
            class="py-3 sidebar-top"
            v-for="(sect, i) in sidebarTop"
            :key="i"
            v-html="sect"
            v-if="!empty(sect)"/>
          <b-img-lazy
            v-if="!empty(imgs)"
            v-for="(img, i) in imgs"
            :key="i"
            class="py-3"
            fluid
            :src="img.src"
            :alt="img.alt"/>
          <div
            class="py-3"
            v-for="(sect, i) in sidebarBottom"
            :key="i"
            v-html="sect"
            v-show="!empty(sidebarBottom)"/>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script>
import { isEmpty } from "lodash";
export default {
  name: "SidebarTextImage",
  props: {
    titleTag: {
      type: String,
      default: "h4"
    },
    title: {
      type: String,
      default: ""
    },
    body: {
      type: String,
      default: ""
    },
    sidebarTop: {
      type: Array,
      default: () => []
    },
    sidebarBottom: {
      type: Array,
      default: () => []
    },
    imgs: {
      type: Array,
      default: () => []
    },
    leftImg: {
      type: Object,
      default: null
    },
    moreLink: {
      type: Object,
      default: null
    }
  },
  methods: {
    empty(thing) {
      return isEmpty(thing);
    }
  }
};
</script>
<style lang="scss">
.sidebar-text-image {
  font-weight: 400;
  color: $gray-700;
}
.title {
  font-weight: 600;
  font-size: 1.75rem;
  color: $indigo;
}
.more-link {
  font-weight: 500;
  color: $blue-dark;
}
.fancy-chevron {
  @include chevron(0.5rem, 3px, 1px, $blue-dark);
}

.summary-with-image {
  display: block;
  clear: both;
  margin-bottom: 15px;
  min-height: 116px;
}
/* video toc links */
.sidebar-text-image .container .row .py-3.sidebar-top {
  padding-top: 5.4rem !important;
}
</style>

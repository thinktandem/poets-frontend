<template>
  <component
    :is="tag"
    class="announcement pt-3">
    <div 
      class="announcement__date pb-2" 
      v-if="null !== date">
      {{ date }}
    </div>
    <div 
      class="announcement__text" 
      v-html="teaserText" />
    <div
      class="announcement__read-more pt-1 pb-3" 
      v-if="null !== link && body.length > 300">
      <b-link :to="link">read more</b-link>
    </div>
  </component>
</template>

<script>
export default {
  name: "AppAnnouncement",
  props: {
    body: {
      type: String,
      required: true
    },
    date: {
      type: String,
      default: null
    },
    link: {
      type: String,
      default: null
    },
    tag: {
      type: String,
      default: "li"
    }
  },
  computed: {
    teaserText() {
      return this.body.length > 300
        ? `${this.body.substr(0, this.body.lastIndexOf(" ", 222))}...`
        : this.body;
    }
  }
};
</script>

<style scoped lang="scss">
.announcement {
  border-bottom: 1px var(--gray) solid;
  .announcement__date {
    color: var(--red);
    font-size: 0.9rem;
    text-transform: uppercase;
  }
  .announcement__text {
    font-weight: 400;
  }
  .announcement__read-more {
    a {
      text-decoration: underline;
    }
  }
}
</style>

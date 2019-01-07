<template>
  <div
    class="announcement pt-3">
    <div 
      class="announcement__date pb-2" 
      v-if="null !== date">
      {{ date }}
    </div>
    <div class="announcement__text">
      {{ title }}
    </div>
    <div 
      class="announcement__read-more pt-1 pb-3" 
      v-if="null !== link">
      <b-link :to="link">read more</b-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppAnnouncement",
  props: {
    title: {
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

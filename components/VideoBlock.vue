<template>
  <component :is="tag">
    <h3>{{ title }}</h3>
    <div class="video-block__video">
      <b-embed
        type="iframe"
        allowfullscreen
        :src="`https://www.youtube.com/embed/${youtubeId}`"/>
    </div>
    <div class="video-block__description">
      <div v-html="replaceFileUrl(body)"/>
      <div class="video-block__links d-flex justify-content-start pt-3">
        <b-link
          v-if="vimeoId !== null"
          target="_blank"
          :href="`https://vimeo.com/${vimeoId}`">Watch on Vimeo</b-link>
        <b-link
          target="_blank"
          :href="`https://www.youtube.com/watch?v=${youtubeId}`">Watch on Youtube</b-link>
      </div>
    </div>
  </component>
</template>

<script>
export default {
  name: "VideoBlock",
  props: {
    title: {
      type: String,
      default: "Video Title"
    },
    tag: {
      type: String,
      default: "div"
    },
    body: {
      type: String,
      default: ""
    },
    youtubeId: {
      type: String,
      required: true
    },
    vimeoId: {
      type: String,
      default: null
    }
  }
};
</script>

<style scoped lang="scss">
h3 {
  font-size: 1.25rem;
}
.video-block__description {
  font-size: 0.9rem;
  font-weight: 400;
  line-height: 1.25rem;
  padding: ($spacer * 1.5) ($spacer);
}
.video-block__links {
  a {
    color: var(--black);
    font-weight: 400;
    text-decoration: underline;
    &:first-child {
      padding-right: $spacer * 1.25;
    }
  }
}
</style>

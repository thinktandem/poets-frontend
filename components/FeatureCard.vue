<template>
  <b-card
    class="feature"
    :title="title"
    :sub-title="subtitle"
    title-tag="h3"
    sub-title-tag="h4"
    ref="featureCard"
  >
    <b-img
      slot="header"
      v-if="img"
      :src="img.src"
      :alt="img.alt" />
    <div
      slot="header"
      v-if="video"
      v-html="video" />
    <p
      class="card-text"
      v-html="text" />
    <div
      slot="footer"
      class="card-bg-extender"
      :style="{width: cardBgExtenderWidth, height: cardBgExtenderHeight}" />
  </b-card>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    subtitle: {
      type: String,
      default: ""
    },
    text: {
      type: String,
      default: ""
    },
    img: {
      type: Object,
      default: function() {}
    },
    video: {
      type: String,
      default: ""
    },
    link: {
      type: Object,
      default: function() {}
    }
  },
  data() {
    return {
      cardBgExtenderWidth: "",
      cardBgExtenderHeight: ""
    };
  },
  mounted: function() {
    this.cardBgExtender();
  },
  methods: {
    cardBgExtender() {
      let self = this;
      this.$nextTick(function() {
        let cardWidth = self.$refs.featureCard.clientWidth;
        let bodyHeight = self.$refs.featureCard.children[1].clientHeight;
        self.cardBgExtenderWidth = cardWidth + "px";
        self.cardBgExtenderHeight = bodyHeight + "px";
      });
    }
  }
};
</script>

<style lang="scss">
$feature__img__offset: 2rem;
.feature {
  padding-top: $feature__img__offset;
  background-color: transparent;
  align-items: flex-start;
  position: relative;
  border: none;
  overflow: hidden;

  @include media-breakpoint-up(md) {
    flex-direction: row;
  }

  .card-header {
    width: 100%;
    padding: 0;

    @include media-breakpoint-up(md) {
      flex-basis: 50%;
      transform: translateY(-$feature__img__offset);
    }

    @include media-breakpoint-up(lg) {
      flex-basis: 25%;
    }

    // Responsive image that takes up the whole width.
    img {
      @extend .img-fluid;
      width: 100%;
    }

    // Cater for videos.
    > div {
      @extend .embed-responsive;
      @extend .embed-responsive-16by9;

      iframe {
        @extend .embed-responsive-item;
      }
    }
  }
  .card-bg-extender {
    background-color: var(--white);
  }

  .card-body {
    padding: 1.5rem;
    display: flex;
    flex-wrap: wrap;
    background-color: $white;

    @include media-breakpoint-up(md) {
      flex-basis: 50%;
    }

    @include media-breakpoint-up(lg) {
      flex-basis: 75%;
    }

    .card-title {
      order: 2;
      width: 100%;
      font-size: 2rem;
      font-family: $font-family-sans-serif;
      font-weight: 600;
      font-style: normal;
    }

    .card-subtitle {
      order: 1;
      width: 100%;
      font-size: 1rem;
      color: $red-dark !important;
      font-weight: 600;
    }

    .card-text {
      order: 3;
      width: 100%;
      font-weight: normal;
      font-size: 0.875rem;
    }
  }

  .card-footer {
    position: absolute;
    top: $feature__img__offset;
    left: $feature__img__offset;
    padding: 0;
    z-index: -1;
  }
}
</style>

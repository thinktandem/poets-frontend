<template>
  <article
    class="feature bg-white d-flex flex-column"
    :class="direction">
    <div
      class="feature__media d-flex justify-content-center justify-content-lg-end"
      :class="direction">
      <b-img-lazy
        v-if="img"
        :src="img.src"
        :alt="img.alt" />
      <b-embed
        type="iframe"
        allowfullscreen
        :src="videoUrl"
        v-if="video"/>
    </div>
    <div class="feature__content py-3 h-100">
      <span class="feature__subtitle">{{ subtitle }}</span>
      <h3 class="feature__title"><b-link
        :to="link"
        class="text-dark">{{ title }}</b-link></h3>
      <app-teaser-text
        :text="text"
        class="feature__text"/>
    </div>
  </article>
</template>

<script>
import AppTeaserText from "~/components/AppTeaserText";
export default {
  name: "AppFeature",
  components: { AppTeaserText },
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
      type: String,
      default: "/"
    },
    reverse: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    videoUrl() {
      const matches = this.video.match(
        /^https?:\/\/(www\.)?((?!.*list=)youtube\.com\/watch\?.*v=|youtu\.be\/)(?<id>[0-9A-Za-z_-]*)/
      );
      return matches.length >= 4
        ? `https://www.youtube.com/embed/${matches[3]}`
        : null;
    },
    direction() {
      return this.reverse ? "flex-lg-row-reverse" : "flex-lg-row";
    }
  }
};
</script>

<style lang="scss" scoped>
$featureOffset: 2rem;
$mediaOffset: 1.25rem;
.feature {
  position: relative;
}
.feature__subtitle {
  color: $red;
  font-weight: 600;
  text-transform: capitalize;
  line-height: 1.75;
}
.feature__title {
  font-size: 1.75rem;
  font-weight: 600;
  line-height: 2rem;
}
.feature__media {
  position: relative;
  width: 100%;
  height: auto;
  img {
    width: 100%;
    height: 100%;
  }
}
.feature__text {
  font-size: 0.9rem;
  font-weight: 400;
  line-height: 1.25rem;
}
.feature__content {
  padding-left: $spacer;
  padding-right: $spacer;
}
@include media-breakpoint-up(lg) {
  .feature {
    max-width: 61rem;
    margin: 2rem;
  }
  .flex-lg-row.feature {
    left: $featureOffset;
  }

  .flex-lg-row-reverse.feature {
    right: $featureOffset;
  }

  .feature__media {
    top: -$mediaOffset;
    width: 385px;
    position: absolute;
  }
  .flex-lg-row .feature__media {
    left: -$mediaOffset;
  }

  .flex-lg-row-reverse .feature__media {
    right: -$mediaOffset;
  }

  .flex-lg-row .feature__content {
    padding-left: 390px;
    padding-right: $spacer * 2;
  }
  .flex-lg-row-reverse .feature__content {
    padding-right: 390px;
    padding-left: $spacer * 1.5;
  }
}
</style>

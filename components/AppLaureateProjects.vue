<template>
  <section
    id="laureate-component"
    class="feature bg-white d-flex flex-column flex-lg-row-reverse">
    <a :href="features.link">
      <div
        class="lpi-box feature__media d-lg-flex justify-content-lg-end flex-lg-row-reverse font-serif font-italic">
        {{ features.title }}
      </div>
    </a>
    <div
      class="feature__content py-3 h-100">
      <a :href="features.link">
        <h3>{{ features.title }}</h3>
      </a>
      <div
        class="lpi-blurb"
        v-html="features.blurb.value"/>
      <div class="lpi-learn-more">
        <a
          class="lpi-learn-more-link"
          :href="features.link">Learn More &gt; </a>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  name: "FeatureStack",
  components: {},
  props: {
    titleTag: {
      type: String,
      default: "h2"
    },
    title: {
      type: String,
      default: ""
    },
    features: {
      type: Object,
      default: null
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
.feature__media {
  position: relative;
  width: 100%;
  height: auto;
  img {
    width: 100%;
    height: 100%;
  }
}
.feature__content {
  padding-left: $spacer;
  padding-right: $spacer;
}
@include media-breakpoint-up(lg) {
  .feature {
    margin: 2rem;
  }
  .flex-lg-row.feature {
    left: $featureOffset;
  }

  .flex-lg-row-reverse.feature {
    // right: $featureOffset;
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

@include media-breakpoint-up(lg) {
  .feature-stack {
    padding-top: 5rem;
    padding-bottom: 7rem;
  }
}

.lpi-box {
  padding: 2rem;
  background-color: #00b4f0;
  color: #fff;
  font-size: 2.6rem;
}
.lpi-blurb /deep/ p {
  font-weight: 400;
  font-size: 1.1rem;
}
.lpi-learn-more-link {
  font-size: 1.2rem;
}
</style>

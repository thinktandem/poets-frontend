<template>
  <b-jumbotron
    class="hero"
    :style="this.bgStyles"
    bg-variant="primary"
    :class="variantStyle"
    fluid>
    <div class="hero__logo-container">
      <main-logo class="hero__logo"/>
    </div>
    <b-row>
      <b-col
        sm=12
        md=8
        class="mt-3 mt-md-5"
      >
        <h1
          v-if="this.heading !== ''"
          class="hero__heading pb-3"
        >{{ this.heading }}</h1>
        <p
          v-if="this.lead"
          class="lead mb-3"
        >{{ this.lead }}</p>
        <div
          class="hero__subtext"
          v-if="this.subtext !== ''">
          {{ this.subtext }}
        </div>
      </b-col>
      <b-col
        class="pr-md-0 pl-md-3"
        sm=12
        md=4>
        <AppHeroSearch />
      </b-col>
    </b-row>
  </b-jumbotron>
</template>

<script>
import AppHeroSearch from "~/components/AppHero/AppHeroSearch";
import MainLogo from "~/static/hero/main.svg";

export default {
  components: { AppHeroSearch, MainLogo },
  props: {
    heading: {
      type: String,
      default: "",
      required: false
    },
    lead: {
      type: String,
      default: ""
    },
    subtext: {
      type: String,
      default: ""
    },
    background: {
      type: String,
      default: "/hero/bg.png"
    },
    variant: {
      type: String,
      default: "default"
    }
  },
  computed: {
    bgStyles() {
      return {
        background: `url(${this.background}) no-repeat center center`,
        backgroundSize: "cover"
      };
    },
    variantStyle() {
      const classes = {
        default: "hero--default",
        quote: "hero--quote"
      };
      return classes[this.variant];
    }
  }
};
</script>

<style scoped lang="scss">
.hero {
  padding-bottom: 0.25 * $spacer;
  margin-bottom: 0;
}
.hero__logo-container {
  max-width: 50%;
}
.hero__logo {
  max-width: 100%;
  height: auto;
}

.hero__heading {
  font-family: $font-family-serif;
  font-style: italic;
  font-weight: 500;
}

.lead {
  font-family: $font-family-serif;
  font-size: 1.2rem;
  line-height: 1.75rem;
}
.hero__subtext {
  font-size: 0.9rem;
  line-height: 1.25rem;
  padding-bottom: 1.4rem;
}

// Quote variation
.hero--quote {
  .lead {
    font-weight: 200;
    font-size: 1.25rem;
    font-style: italic;
    quotes: "“" "”" "‘" "’";
    &:before {
      content: open-quote;
    }
    &:after {
      content: close-quote;
    }
  }
}
@include media-breakpoint-up(md) {
  .hero {
    padding-bottom: 0;
    border-bottom: 2px solid $white;
  }
  .lead {
    font-size: 1.9rem;
    line-height: 2.4rem;
  }

  .hero--quote {
    .lead {
      font-size: 2.3rem;
    }
  }
}
</style>

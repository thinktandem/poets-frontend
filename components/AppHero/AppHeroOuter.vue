<template>
  <b-jumbotron
    class="hero pb-0 mb-0"
    :style="this.bgStyles"
    bg-variant="primary"
    :class="variantStyle"
    fluid>
    <b-row>
      <b-col
        sm=12
        class="hero__poets-hp-link"
        v-html="this.logo"/>
      <b-col
        sm=12
        md=8
        class="mt-5"
      >
        <h1
          v-if="this.heading !== ''"
          class="hero__heading pb-3"
        >{{ this.heading }}</h1>
        <p
          v-if="this.lead"
          class="lead pb-3"
        >{{ this.lead }}</p>
        <div
          class="hero__subtext"
          v-if="this.subtext !== ''">
          {{ this.subtext }}
        </div>
      </b-col>
      <b-col
        sm=12
        md=4>
        <AppHeroSearch />
      </b-col>
    </b-row>
  </b-jumbotron>
</template>

<script>
import AppHeroSearch from "./AppHeroSearch";

export default {
  components: { AppHeroSearch },
  props: {
    logo: {
      type: String,
      default: `
        <a href="/">
          <span class="text-white">poets</span><span class="text-black">.org</span>
        </a>
      `,
      required: false
    },
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
.hero__poets-hp-link {
  font-size: 60px;
  font-weight: 700;
  line-height: 0.75;
}

.hero__heading {
  font-family: "Poets Electra Roman No 2";
  font-style: italic;
  font-weight: 500;
}

.lead {
  font-family: "Poets Electra";
  font-size: 1.9rem;
  line-height: 2.4rem;
}
.hero__subtext {
  font-size: 14px;
}

// Quote variation
.hero--quote {
  .lead {
    font-weight: 200;
    font-size: 2.3rem;
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
</style>

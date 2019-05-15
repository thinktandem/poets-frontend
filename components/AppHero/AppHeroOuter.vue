<template>
  <b-jumbotron
    class="hero"
    :style="bgStyles"
    bg-variant="primary"
    :class="variantStyle"
    fluid>
    <div class="hero__logo-container">
      <main-logo
        class="hero__logo"
        :logo="pickLogo"/>
    </div>
    <b-row>
      <b-col
        sm=12
        md=8
        class="mt-3 mt-md-5"
      >
        <h1
          v-if="heading && variant === 'default' && displayHeading"
          class="hero__heading pb-3"
        >{{ heading }}</h1>
        <p
          v-if="lead"
          class="lead mb-3 font-serif"
        >{{ lead }}</p>
        <div
          class="hero__subtext"
          v-if="subtext">
          {{ subtext }}
        </div>
      </b-col>
      <b-col
        class="pr-md-0 pl-md-3 d-flex flex-column"
        sm=12
        md=4>
        <AppHeroSearch />
      </b-col>
    </b-row>
  </b-jumbotron>
</template>

<script>
import AppHeroSearch from "~/components/AppHero/AppHeroSearch";
import MainLogo from "~/components/AppHero/MainLogo";

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
      type: Object,
      default: () => {
        const randomFallbackNumber = Math.floor(Math.random() * 6);
        return {
          src: `/hero/bg${randomFallbackNumber}.jpg`
        };
      }
    },
    variant: {
      type: String,
      default: "default"
    }
  },
  computed: {
    bgStyles() {
      const background = this.background;
      return {
        backgroundImage: `url(${background.src})`,
        backgroundPositionX: "center",
        backgroundPositionY: "center",
        backgroundRepeatY: "no-repeat",
        backgroundRepeatY: "no-repeat",
        backgroundSize: "cover"
      };
    },
    variantStyle() {
      const classes = {
        default: "hero--default",
        quote: "hero--quote"
      };
      return classes[this.variant];
    },
    pickLogo() {
      const path = this.$route.path;
      let src = "/hero/Large-White-RGB-poets.org-Logo.png";
      let alt = "Poets.org Logo";
      let link = "/";
      if (path.includes("/national-poetry-month")) {
        src = "/hero/Large-White-RGB-National-Poetry-Month-Logo.png";
        alt = "National Poetry Month Logo";
        link = "/national-poetry-month";
      } else if (path.includes("/academy-american-poets")) {
        src = "/hero/Large-White-RGB-Academy-of-American-Poets-Logo.png";
        alt = "Academy of American Poets Logo";
        link = "/academy-american-poets";
      } else if (path.includes("/american-poets-magazine")) {
        src = "/hero/Large-White-RGB-American-Poets-Logo.png";
        alt = "Acacemy of American Poets Magazine Logo";
        link = "/american-poets-magazine";
      }
      return {
        src,
        alt,
        link
      };
    },
    /*
     * On the site vertical pages title duplicates info in logo; supress titles
     * on those pages.
     */
    displayHeading() {
      const path = this.$route.path;

      if (
        path === "/" ||
        path === "/national-poetry-month" ||
        path === "/academy-american-poets" ||
        path === "/american-poets-magazine"
      ) {
        return false;
      } else {
        return true;
      }
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

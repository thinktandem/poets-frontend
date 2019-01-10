<template>
  <b-card
    class="card--callout"
    :bg-variant="bg">
    <b-img
      class="card--callout__image"
      :src="img.src"
      width="110"
      height="110"
      blank-color="#00B4F0"/>
    <h4
      class="card-title"
      v-if="null !== titleLink">
      <b-link :to="titleLink">{{ title }}</b-link>
    </h4>
    <h4
      class="card-title"
      v-else>
      {{ title }}
    </h4>
    <p class="card-text">{{ text }}</p>
    <div
      slot="footer"
      v-if="null !== action.to">
      <b-form
        @submit.stop.prevent="signUp"
        inline
      >
        <b-form-input
          v-model="email"
          type="email"
          placeholder="you@example.com"
        />
        <b-btn
          class="border-primary bg-white text-primary"
          @click.stop.prevent="signUp"
        >
          {{ action.text }}
        </b-btn>
      </b-form>
    </div>
  </b-card>
</template>

<script>
export default {
  name: "CalloutCard",
  data() {
    return {
      email: ""
    };
  },
  props: {
    title: {
      type: String,
      default: "Teach This Poem"
    },
    titleLink: {
      type: String,
      default: null
    },
    img: {
      type: Object,
      default() {
        return {
          src: "/images/bulb-book.png"
        };
      }
    },
    text: {
      type: String,
      default: ""
    },
    action: {
      type: Object,
      default() {
        return {
          to: null,
          text: ""
        };
      }
    },
    variant: {
      type: String,
      default: "default"
    }
  },
  computed: {
    bg() {
      const map = {
        default: "white",
        bold: "warning"
      };
      return map[this.variant];
    }
  },
  methods: {
    signUp() {
      const body = {
        email: this.email,
        forms: {
          AAPTTP: true
        }
      };
      this.$axios
        .post(`/api/cm/poem-a-day`, body)
        .then(() => {
          this.$toast
            .show("Thanks! You are subscribed.", {
              theme: "toasted-primary",
              position: "top-left"
            })
            .goAway(1500);
        })
        .catch(err => {
          this.$toast
            .show(
              "Sorry, there was an error subscribing you, please try again :(",
              {
                theme: "toasted-danger",
                position: "top-left"
              }
            )
            .goAway(1500);
          console.log(err);
        });
    }
  }
};
</script>

<style scoped lang="scss">
.card--callout {
  padding-top: $spacer * 3;
  padding-bottom: $spacer / 2;
  border: none;
  .card-title {
    font-size: 1.15rem;
    line-height: 1.75rem;
    font-family: $font-family-sans-serif;
    font-weight: bold;
    font-style: normal;
  }
  .card-text {
    padding: 0;
    font-size: 0.9rem;
    font-weight: 400;
  }
  .card-header,
  .card-footer {
    padding-top: $spacer / 2;
    background-color: $orange;
  }
  &__image {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: -55px;
  }
  @include media-breakpoint-up(md) {
    padding-left: $spacer * 5.75;
    padding-top: initial;
    .card-body {
      padding: ($spacer * 1.25) ($spacer * 3) 0 0;
    }
    .card-footer {
      padding-left: 0;
    }
    &__image {
      position: absolute;
      left: -13px;
      top: -13px;
      transform: initial;
    }
  }
}
</style>

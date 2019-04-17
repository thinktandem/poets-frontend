<template>
  <b-card
    class="card--callout"
    :bg-variant="bg"
  >
    <b-img-lazy
      v-if="!empty(img)"
      class="card--callout__image"
      :src="img.src"
      :alt="img.alt"
      width="110"
    />
    <h4
      class="card-title"
      v-if="null !== titleLink"
    >
      <b-link :to="titleLink">{{ title }}</b-link>
    </h4>
    <h4
      class="card-title"
      v-else
    >
      {{ title }}
    </h4>
    <app-teaser-text
      class="card-text"
      :length="teaserLength"
      :text="text"
    />
    <div
      slot="footer"
      v-if="null !== action.to"
    >
      <b-btn
        class="border-primary bg-white text-primary"
        @click="showModal"
      >
        {{ action.text }}
      </b-btn>
    </div>
    <b-modal
      :title="title"
      @ok="signUp"
      ok-title="Sign Up"
      v-if="null !== action.text"
      :ref="`${this._uid}-modal`"
    >
      Sign up to receive our weekly series for teachers, featuring a poem for K-12 students, accompanied by related interdisciplinary resources and classroom activities
      <app-form @submit.stop.prevent="signUp">
        <b-form-group
          class="my-2"
          id="teachPoemEmailGroup"
          description="Enter your email to sign up"
          label-sr-only
          label-for
          label="Email"
        >
          <b-form-input
            name="teachPoemEmail"
            v-model="email"
            type="email"
            placeholder="you@example.com"
          />
        </b-form-group>
      </app-form>
    </b-modal>
  </b-card>
</template>

<script>
import AppTeaserText from "~/components/AppTeaserText";
import { isEmpty } from "lodash";
export default {
  name: "CalloutCard",
  components: { AppTeaserText },
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
      default: null
    },
    text: {
      type: String,
      default: ""
    },
    teaserLength: {
      type: Number,
      default: 100
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
    empty(thing) {
      return isEmpty(thing);
    },
    showModal() {
      this.$refs[`${this._uid}-modal`].show();
    },
    signUp(bvModalEvt) {
      bvModalEvt.preventDefault();

      const body = {
        email: this.email,
        forms: {
          AAPTTP: true
        }
      };
      this.$axios
        .post(`/api/cm/poem-a-day`, body)
        .then(() => {
          this.$toast.success("Thanks! You are subscribed.").goAway(1500);
          this.$nextTick(() => {
            // Wrapped in $nextTick to ensure DOM is rendered before closing
            this.$refs[`${this._uid}-modal`].hide();
          });
        })
        .catch(error => {
          console.log(error);
          const message =
            "Sorry, there was an error subscribing you, please try again :(";
          this.$toast.error(message).goAway(1500);
          this.$sentry.captureException(error);
        });
    }
  }
};
</script>

<style scoped lang="scss">
.card--callout {
  padding-top: $spacer * 3;
  padding-bottom: 1rem;
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

  .card-footer {
    padding: 0 1rem;

    @include media-breakpoint-up(md) {
      padding-top: 1rem;
      padding-bottom: 0.5rem;
    }
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

<template>
  <div class="sign-up p-3 bg-black">
    <poem-actions
      color="light"
      :poem="poem"
      v-if="showActions"/>
    <div class="poem-a-day-sign-up__title text-white">
      {{ title }}
    </div>
    <div class="poem-a-day-sign-up__description text-white">
      <p>{{ text }}</p>
    </div>
    <b-form
      @submit.prevent="poemADaySignup">
      <label
        class="sr-only"
        for="poemADayEmail">Email Address</label>
      <b-input-group>
        <b-form-input
          id="poemADayEmail"
          v-model="email"
          type="email"
          class="border-0"
          placeholder="john@example.com"/>
        <b-input-group-append>
          <b-btn
            type="submit"
            variant="primary-dark">Sign Up</b-btn>
        </b-input-group-append>
      </b-input-group>
    </b-form>
  </div>
</template>

<script>
import PoemActions from "~/components/PoemActions";
export default {
  components: { PoemActions },
  data() {
    return {
      email: ""
    };
  },
  methods: {
    poemADaySignup() {
      const body = {
        email: this.email,
        forms: {
          AAPPAD: true
        }
      };
      this.$axios
        .post(`/api/cm/${this.list}`, body)
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
    },
    print() {
      window.print();
    }
  },
  props: {
    title: {
      type: String,
      default: "sign up for poem-a-day"
    },
    text: {
      type: String,
      default: "Receive a new poem in your inbox daily"
    },
    list: {
      type: String,
      default: "poem-a-day"
    },
    poem: {
      type: Object,
      default() {
        return {
          alias: "",
          title: ""
        };
      }
    },
    showActions: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped lang="scss">
.sign-up {
  font-weight: 600;
  width: 100%;
  .poem-a-day-sign-up__title {
    font-family: $font-family-sans-serif;
    font-size: 1.4rem;
    font-weight: 600;
    padding-bottom: $spacer / 2;
    line-height: 2rem;
  }
  .poem-a-day-sign-up__description {
    font-size: 0.9rem;
    font-weight: 400;
    line-height: 1.4;
  }
}
</style>

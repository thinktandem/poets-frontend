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
    <app-form
      @submit="poemADaySignup">
      <label
        class="sr-only"
        for="poemADayEmail">Email Address</label>
      <b-input-group>
        <b-form-input
          id="poemADayEmail"
          v-model="email"
          type="email"
          class="border-0"
          :placeholder="placeholderEmail"/>
        <b-input-group-append>
          <b-btn
            type="submit"
            variant="primary-dark">Sign Up</b-btn>
        </b-input-group-append>
      </b-input-group>
    </app-form>
  </div>
</template>

<script>
import _ from "lodash";
import Swal from "sweetalert2";
import PoemActions from "~/components/PoemActions";
export default {
  components: { PoemActions },
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
  },
  data() {
    return {
      email: ""
    };
  },
  computed: {
    placeholderEmail() {
      return _.get(this.$auth, "user.meta.mail", "john@example.com");
    }
  },
  methods: {
    poemADaySignup() {
      const mailchimpBase = `${window.location.protocol}//${
        window.location.host
      }`;
      this.$axios({
        method: "post",
        baseURL: mailchimpBase,
        url: "/mailchimp",
        data: { email: this.email, list: [this.list] }
      })
        .then(response => {
          if ((response.status = 201)) {
            Swal.fire("Thanks!", "You are subscribed.", "success");
          }
        })
        .catch(error => {
          console.log(error);
          this.$sentry.captureException(error);
          Swal.fire(
            "Sorry!",
            "There was an error subscrbing you, please try again :(",
            "error"
          );
        });
    },
    print() {
      window.print();
    }
  }
};
</script>

<style scoped lang="scss">
.sign-up {
  font-weight: 600;
  width: 100%;
  .poem__actions {
    width: 100%;
  }
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

<template>
  <div class="poem-a-day-sign-up p-3 bg-black">
    <poem-actions
      color="light"
      :poem="poem" 
      v-if="showActions"/>
    <div class="poem-a-day-sign-up__title text-white">
      sign up for poem-a-day
    </div>
    <div class="poem-a-day-sign-up__description text-white">
      Receive a new poem in your inbox daily
    </div>
    <b-form
      inline
      @submit="poemADaySignup">
      <label 
        class="sr-only" 
        for="poemADayEmail">Email Address</label>
      <b-input-group>
        <b-form-input
          id="poemADayEmail"
          v-model="email"
          type="text"
          placeholder="john@example.com"/>
        <b-input-group-append>
          <b-btn
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
        .post("/api/cm/poem-a-day", body)
        .then(req => {
          console.log("Post req sent");
        })
        .catch(err => {
          console.log(err);
        });
      this.$toast
        .show("Thanks! You are subscribed.", {
          theme: "toasted-primary",
          position: "top-left"
        })
        .goAway(1500);
    },
    print() {
      window.print();
    }
  },
  props: {
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
.poem-a-day-sign-up {
  font-weight: 600;
  width: 100%;
  .poem-a-day-sign-up__title {
    font-family: $font-family-sans-serif;
    font-size: 26px;
    font-weight: 600;
    padding-bottom: 1rem;
    line-height: 1.25ar;
  }
  .poem-a-day-sign-up__description {
    font-size: 14px;
    font-weight: 400;
    line-height: 1.25;
    padding-bottom: 1rem;
  }
}
</style>

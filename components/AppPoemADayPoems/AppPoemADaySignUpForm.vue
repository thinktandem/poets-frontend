<template>
  <div class="poem-a-day-sign-up p-3">
    <div class="poem-a-day-sign-up__social-group">
      <span class="pl-2 pr-2">
        <a href="#">
          <FacebookIcon class="icon"/>
        </a>
      </span>
      <span class="pl-2 pr-2">
        <a href="#">
          <TwitterIcon class="icon"/>
        </a>
      </span>
      <span class="pl-2 pr-2">
        <a href="#">
          <TumblrIcon/>
        </a>
      </span>
      <span class="pl-2 pr-2">
        <a href="#">
          <PrintIcon/>
        </a>
      </span>
      <span class="pl-2 pr-2">
        <a href="#">
          <EmbedIcon/>
        </a>
      </span>
      <span class="pl-2 pr-2">
        <a href="#">
          <CollectionIcon/>
        </a>
      </span>
    </div>
    <div class="poem-a-day-sign-up__title pt-2">
      sign up for poem-a-day
    </div>
    <div class="poem-a-day-sign-up__description pt-2 pb-2">
      Receive a new poem in your inbox daily
    </div>
    <form
      class="poem-a-day-signup-form"
      @submit.prevent="poemADaySignup">
      <label class="sr-only">Email Address</label>
      <input
        v-model="email"
        type="text"
        placeholder="john@example.com"
        class="form-control">
      <button
        type="button"
        class="btn btn-primary poem-a-day-button">
        Sign Up
      </button>
    </form>
  </div>
</template>

<script>
import FacebookIcon from "~/static/social/facebook.svg";
import TwitterIcon from "~/static/social/twitter.svg";
import TumblrIcon from "~/static/social/tumblr.svg";
import PrintIcon from "~/static/social/print.svg";
import EmbedIcon from "~/static/social/embed.svg";
import CollectionIcon from "~/static/social/collection.svg";
export default {
  components: {
    FacebookIcon,
    TwitterIcon,
    TumblrIcon,
    PrintIcon,
    EmbedIcon,
    CollectionIcon
  },
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
          aappad: true
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
      this.$router.push("/poem-a-day-thanks");
    }
  }
};
</script>
<style scoped lang="scss">
.poem-a-day-sign-up {
  color: var(--white);
  font-weight: 600;
  background-color: var(--black);
  width: 100%;
  .poem-a-day-sign-up__title {
    font-family: $font-family-sans-serif;
    font-size: 26px;
    font-weight: 600;
  }
  .poem-a-day-sign-up__description {
    font-size: 14px;
    font-weight: 100;
  }
  form {
    input {
      width: 67%;
      height: 43px;
      display: inline-block;
    }
    input,
    .poem-a-day-button {
      border-radius: 0;
      vertical-align: baseline;
    }
    .poem-a-day-button {
      background-color: var(--blue-dark);
      border: none;
    }
  }
}
</style>

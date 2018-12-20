<template>
  <div class="poem-a-day-sign-up p-3 bg-black">
    <ul class="list-inline poem-a-day-sign-up__social-group d-flex flex-row flex-wrap justify-content-between mr-4 pr-5">
      <li class="list-inline-item">
        <b-link :href="facebookUrl">

          <FacebookIcon class="icon"/>

        </b-link>
      </li>
      <li class="list-inline-item">
        <b-link :href="twitterUrl">

          <TwitterIcon class="icon"/>

        </b-link>
      </li>
      <li class="list-inline-item">
        <b-link :href="tumblrUrl">

          <TumblrIcon/>

        </b-link>
      </li>
      <li class="list-inline-item">
        <b-link @click="print()">

          <PrintIcon/>

        </b-link>
      </li>
      <li class="list-inline-item">
        <b-link v-b-modal.poemEmbedModal>

          <EmbedIcon/>

        </b-link>
      </li>
      <li class="list-inline-item">
        <b-link>

          <CollectionIcon/>

        </b-link>
      </li>
    </ul>
    <div class="poem-a-day-sign-up__title pt-2 text-white">
      sign up for poem-a-day
    </div>
    <div class="poem-a-day-sign-up__description pt-2 pb-2 text-white">
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
        class="btn btn-primary poem-a-day-button"
        @click.stop.prevent="poemADaySignup">
        Sign Up
      </button>
    </form>
    <b-modal
      title="embed this poem"
      centered
      lazy
      size="lg"
      header-border-variant="0"
      :cancel-disabled="true"
      id="poemEmbedModal">
      <b-textarea
        plaintext
        rows="3"
        class="poem-a-day__embed-code border p-2"
        :value="embedTag"/>
      <template slot="modal-footer">
        <b-btn
          v-b-popover.top="'Copied to clipboard!'"
          variant="info"
          @click="copyEmbed">Copy to clipboard</b-btn>
      </template>
    </b-modal>
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
  computed: {
    facebookUrl() {
      return `https://facebook.com/sharer.php?u=${this.siteUri}&t=${
        this.title
      }`;
    },
    twitterUrl() {
      return `https://twitter.com/share?text=${this.title}&url=${this.siteUri}`;
    },
    tumblrUrl() {
      return `https://tumblr.com/share/link?url=${this.siteUri}&name=${
        this.title
      }`;
    },
    embedTag() {
      return `<iframe width='575' height='1100' src='${
        this.siteUri
      }?mbd=1' frameborder='0' scrolling='no' allowfullscreen></iframe>`;
    }
  },
  data() {
    return {
      siteUri: encodeURIComponent(`https://www.poets.org${this.poem.alias}`),
      title: encodeURIComponent(this.poem.title),
      email: ""
    };
  },
  methods: {
    copyEmbed() {
      const copyTextarea = document.querySelector(".poem-a-day__embed-code");
      copyTextarea.focus();
      copyTextarea.select();

      try {
        document.execCommand("copy");
      } catch (err) {
        console.log("Oops, unable to copy");
      }
    },
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
      this.$toast.success("Thanks! You are subscribed.").goAway(1500);
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

<template>
  <div class="anthology__actions">
    <ul class="anthology__actions__social d-flex flex-wrap">
      <li class="pr-2">
        <b-link
          target="_blank"
          :href="facebookUrl">
          <img src="/social/facebook.svg">
        </b-link>
      </li>
      <li class="pr-2">
        <b-link
          target="_blank"
          :href="twitterUrl">
          <img src="/social/twitter.svg">
        </b-link>
      </li>
      <li
        class="pr-2">
        <b-link
          target="_blank"
          :href="tumblrUrl">
          <img src="/social/tumblr.svg">
        </b-link>
      </li>
      <li>
        <b-link v-b-modal.anthologyEmbedModal>
          <img src="/social/embed.svg">
        </b-link>
      </li>
    </ul>
    <b-modal
      title="embed this anthology"
      centered
      lazy
      size="lg"
      header-border-variant="0"
      :cancel-disabled="true"
      id="anthologyEmbedModal">
      <b-textarea
        plaintext
        rows="3"
        class="anthology__embed-code border p-2"
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
import EmbedIcon from "~/static/social/embed.svg";

export default {
  name: "AnthologyActions",
  components: {
    FacebookIcon,
    TwitterIcon,
    TumblrIcon,
    EmbedIcon
  },
  props: {
    anthology: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    title() {
      return encodeURIComponent(this.anthology.title);
    },
    siteUri() {
      return `${process.env.appURL}${this.anthology.alias}`;
    },
    encodedUri() {
      return encodeURIComponent(this.siteUri);
    },
    facebookUrl() {
      return `https://facebook.com/sharer.php?u=${this.encodedUri}&t=${
        this.title
      }`;
    },
    twitterUrl() {
      return `https://twitter.com/share?text=${this.anthology.title}&url=${
        this.encodedUri
      }`;
    },
    tumblrUrl() {
      return `https://tumblr.com/share/link?url=${this.encodedUri}&name=${
        this.title
      }`;
    },
    embedTag() {
      return `<iframe width='575' height='1100' src='${
        this.siteUri
      }?mbd=1' frameborder='0' scrolling='yes' allowfullscreen></iframe>`;
    }
  },
  methods: {
    copyEmbed() {
      const copyTextarea = document.querySelector(".anthology__embed-code");
      copyTextarea.focus();
      copyTextarea.select();

      try {
        document.execCommand("copy");
      } catch (error) {
        console.error("Oops, unable to copy");
        this.$sentry.captureException(error);
      }
    }
  }
};
</script>
<style scoped lang="scss">
.anthology__actions {
  position: relative;
  width: 100%;
  flex-grow: 1;
  margin-bottom: $spacer * 2;
}
ul {
  margin: 0;
  padding: 0;
}
li {
  list-style: none;
}
li img {
  margin: 6px;
}
</style>

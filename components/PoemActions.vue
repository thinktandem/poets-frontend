<template>
  <div
    class="poem__actions"
    :class="`${orientation} ${color}`">
    <ul class="d-flex flex-wrap">
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
      <li class="pr-2">
        <b-link
          target="_blank"
          :href="tumblrUrl">
          <img src="/social/tumblr.svg">
        </b-link>
      </li>
      <li class="pr-2">
        <b-link @click="print()">
          <img src="/social/print.svg">
        </b-link>
      </li>
      <li class="pr-2">
        <b-link v-b-modal.poemEmbedModal>
          <img src="/social/embed.svg">
        </b-link>
      </li>
      <li class="pr-2">
        <b-link>
          <img src="/social/collection.svg">
        </b-link>
      </li>
    </ul>
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
  props: {
    orientation: {
      type: String,
      default: "horizontal"
    },
    color: {
      type: String,
      default: "dark"
    },
    poem: {
      type: Object,
      default() {
        return {};
      }
    }
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
    print() {
      window.print();
    }
  }
};
</script>
<style scoped lang="scss">
.poem__actions {
  position: relative;
  width: 100%;
  flex-grow: 1;
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
@include media-breakpoint-up(md) {
  .vertical {
    position: absolute;
    ul {
      flex-direction: column;
    }
  }
}
</style>

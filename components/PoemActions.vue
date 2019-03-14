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
        <b-link
          target="_blank"
          :to="`/print/poem/${poem.id}`">
          <img src="/social/print.svg">
        </b-link>
      </li>
      <li class="pr-2">
        <b-link v-b-modal.poemEmbedModal>
          <img src="/social/embed.svg">
        </b-link>
      </li>
      <li
        v-show="loggedIn"
        class="pr-2">
        <b-link
          @click="handleAnthologies"
          v-b-modal.add2Anthology>
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

    <b-modal
      :busy="!anthologyIsSubmittable"
      centered
      header-border-variant="0"
      id="add2Anthology"
      lazy
      ok-only
      ok-title="Submit"
      size="lg"
      @shown="clearAnthologyForm"
      title="add to an anthology">
      <b-form>
        <b-form-select
          :disabled="anthologies.loading"
          v-model="anthologies.selected"
          v-show="!showNewAnthology"
          :options="anthologies.options">
          <template slot="first">
            <option :value="null">select an anthology</option>
          </template>
          <option value="_new_">create new anthology</option>
        </b-form-select>
        <b-form-input
          v-model="anthologies.custom"
          v-show="showNewAnthology"
          type="text"
          placeholder="Name your new anthology" />
      </b-form>
    </b-modal>
  </div>
</template>
<script>
import _ from "lodash";
import qs from "qs";
import FacebookIcon from "~/static/social/facebook.svg";
import TwitterIcon from "~/static/social/twitter.svg";
import TumblrIcon from "~/static/social/tumblr.svg";
import PrintIcon from "~/static/social/print.svg";
import EmbedIcon from "~/static/social/embed.svg";
import CollectionIcon from "~/static/social/collection.svg";

// Helper to validate anthologies
const validateAnthology = (data = {}) => {
  return _.has(data, "id") && _.has(data, "attributes.title");
};

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
      siteUri: encodeURIComponent(`https://www.poets.org${this.poem.alias}`),
      title: encodeURIComponent(this.poem.title),
      anthologies: {
        options: [],
        selected: null,
        custom: null,
        loading: true
      }
    };
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
    },
    // We use this to verify user is both logged in and has an ID
    // @todo: show the button and present the login form when a user is not loggedin
    // @todo: this requires some login redirection handling work
    loggedIn() {
      return this.$auth.loggedIn && !!_.get(this.$auth, "user.id", false);
    },
    showNewAnthology() {
      return this.anthologies.selected === "_new_";
    },
    anthologyIsSubmittable() {
      if (this.anthologies.selected === null) {
        return false;
      }
      if (this.showNewAnthology && this.anthologies.custom === null) {
        return false;
      }
      return true;
    },
    userId() {
      return _.get(this.$auth, "user.id", null);
    }
  },
  methods: {
    clearAnthologyForm() {
      this.anthologies.selected = null;
    },
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
    getMyAnthologies() {
      // If we already have options, lets just return those
      if (!_.isEmpty(this.anthologies.options)) {
        return Promise.resolve(this.anthologies.options);
      }

      // Otherwise let's grab the anthologies from the API
      const query = { filter: { "uid.id": this.userId, status: 1 } };
      const queryString = qs.stringify(query);
      return this.$axios
        .get(`/api/node/anthologies?${queryString}`)
        .then(response => _.get(response, "data.data", []))
        .catch(err => [])
        .then(anthologies =>
          _(anthologies)
            .filter(anthology => validateAnthology(anthology))
            .map(anthology => ({
              text: _.get(anthology, "attributes.title"),
              value: _.get(anthology, "id")
            }))
            .value()
        );
    },
    print() {
      window.print();
    },
    handleAnthologies() {
      this.anthologies.loading = true;
      this.getMyAnthologies().then(data => {
        this.anthologies.options = data;
        this.anthologies.loading = false;
      });
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

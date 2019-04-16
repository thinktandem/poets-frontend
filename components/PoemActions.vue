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
      <li
        v-if="minimal">
        <b-link
          target="_blank"
          :href="tumblrUrl">
          <img src="/social/tumblr.svg">
        </b-link>
      </li>
      <li
        v-else
        class="pr-2">
        <b-link
          target="_blank"
          :href="tumblrUrl">
          <img src="/social/tumblr.svg">
        </b-link>
      </li>
      <li
        v-if="!minimal"
        class="pr-2">
        <b-link
          target="_blank"
          :to="`/print/poem/${poem.id}`">
          <img src="/social/print.svg">
        </b-link>
      </li>
      <li
        v-if="!minimal"
        class="pr-2">
        <b-link v-b-modal.poemEmbedModal>
          <img src="/social/embed.svg">
        </b-link>
      </li>
      <li
        v-if="!minimal"
        class="pr-2">
        <b-link
          @click="loadAnthologies"
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
      ref="add2Anthology"
      lazy
      ok-only
      ok-title="Submit"
      :hide-header="!loggedIn"
      :hide-footer="!loggedIn"
      size="lg"
      @ok="submitAnthologies"
      @shown="clearAnthologyForm"
      title="add to an anthology">
      <Login
        v-show="!loggedIn"
        redirect="#"
        show-register-link
        title="Sign in or register to add"
      />
      <b-form v-show="loggedIn">
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
import Login from "~/components/Login";
import FacebookIcon from "~/static/social/facebook.svg";
import TwitterIcon from "~/static/social/twitter.svg";
import TumblrIcon from "~/static/social/tumblr.svg";
import PrintIcon from "~/static/social/print.svg";
import EmbedIcon from "~/static/social/embed.svg";
import CollectionIcon from "~/static/social/collection.svg";

export default {
  components: {
    FacebookIcon,
    Login,
    TwitterIcon,
    TumblrIcon,
    PrintIcon,
    EmbedIcon,
    CollectionIcon
  },
  data() {
    return {
      siteUri: `${process.env.appURL}${this.poem.alias}`,
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
    minimal: {
      type: Boolean,
      default: false
    },
    poem: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    encodedUri() {
      return encodeURIComponent(this.siteUri);
    },
    facebookUrl() {
      return `https://facebook.com/sharer.php?u=${this.encodedUri}&t=${
        this.title
      }`;
    },
    twitterUrl() {
      return `https://twitter.com/share?text=${this.title}&url=${
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
    },
    // We use this to verify user is both logged in and has an ID
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
    }
  },
  methods: {
    clearAnthologyForm() {
      this.anthologies.selected = null;
      this.anthologies.custom = null;
    },
    copyEmbed() {
      const copyTextarea = document.querySelector(".poem-a-day__embed-code");
      copyTextarea.focus();
      copyTextarea.select();

      try {
        document.execCommand("copy");
      } catch (err) {
        this.$sentry.captureException(err);
        console.log("Oops, unable to copy");
      }
    },
    print() {
      window.print();
    },
    loadAnthologies() {
      if (this.loggedIn) {
        this.anthologies.loading = true;
        this.$auth.user.pullAnthologies().then(anthologies => {
          this.anthologies.loading = false;
          this.anthologies.options = _(anthologies)
            .map(anthology => ({
              text: anthology.title,
              value: anthology.id
            }))
            .value();
        });
      }
    },
    submitAnthologies(evt) {
      // Prevent the modal from auto-closing and disable the submit
      evt.preventDefault();
      // Add the poem to an anthology
      return Promise.resolve()
        .then(() => {
          if (this.showNewAnthology && this.anthologies.custom !== null) {
            return this.$auth.user
              .createAnthologies([this.anthologies.custom])
              .then(anthologies => _.map(anthologies, "id"));
          } else {
            return Promise.resolve([this.anthologies.selected]);
          }
        })
        .then(auuids => {
          this.$refs.add2Anthology.hide();
          // Add the poems
          _.forEach(auuids, auuid => {
            this.$auth.user.addPoem(auuid, this.poem.id);
          });

          // Update the anthologies
          this.$auth.user.pushAnthologies(auuids).then(() => {
            _.forEach(auuids, auuid => {
              const title = _.find(this.$auth.user.anthologies, { id: auuid })
                .title;
              this.$toast
                .success(`Added ${this.poem.title} to ${title}`)
                .goAway(5000);
            });
            // Force update our anthologies and reset the user
            this.$auth.user.pullAnthologies(true).then(() => {
              this.$auth.setUser(this.$auth.user);
            });
          });
        })
        .catch(error => {
          console.error(error);
          this.$sentry.captureException(error);
          this.$toast.error("An error occurred!").goAway(3000);
        });
    }
  },
  watch: {
    "$auth.loggedIn": function() {
      this.$auth.fetchUser().then(() => {
        this.loadAnthologies();
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
@include media-breakpoint-up(md) {
  .vertical {
    position: absolute;
    ul {
      flex-direction: column;
    }
  }
}
</style>

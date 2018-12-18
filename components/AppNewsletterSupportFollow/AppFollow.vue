<template>
  <div class="follow">
    <h3 class="signup-title">Follow Us</h3>
    <div class="follow__content">

      <ul>
        <li>
          <b-link :href="facebookUrl">
            <FacebookIcon class="icon" />
          </b-link>
        </li>
        <li>
          <b-link :href="twitterUrl">
            <TwitterIcon class="icon" />
          </b-link>
        </li>
        <li>
          <b-link :href="tumblrUrl">
            <TumblrIcon class="icon" />
          </b-link>
        </li>

      </ul>
    </div>
  </div>
</template>

<script>
import FacebookIcon from "~/static/social/facebook.svg";
import TwitterIcon from "~/static/social/twitter.svg";
import TumblrIcon from "~/static/social/tumblr.svg";

export default {
  components: {
    FacebookIcon,
    TwitterIcon,
    TumblrIcon
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
    }
  }
};
</script>
<style lang="scss" scoped>
ul {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    &:not(:last-child) {
      margin-right: 2rem;
    }

    a {
      svg {
        g {
          fill: var(--primary-dark);
        }
      }
    }
  }
}
</style>

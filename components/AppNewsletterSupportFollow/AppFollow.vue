<template>
  <div class="follow">
    <h3 class="signup-title">Follow Us</h3>
    <div class="follow__content">

      <ul>
        <li
          v-for="i in social"
          :key="i.id"
        >
          <b-link :href="i.url">
            <component :is="i.icon" />
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
import SoundcloudIcon from "~/static/social/soundcloud.svg";
import InstagramIcon from "~/static/social/instagram.svg";
import YoutubeIcon from "~/static/social/youtube.svg";
import PinterestIcon from "~/static/social/pinterest.svg";

export default {
  components: {
    FacebookIcon,
    TwitterIcon,
    TumblrIcon,
    SoundcloudIcon,
    InstagramIcon,
    YoutubeIcon,
    PinterestIcon
  },
  computed: {
    social() {
      return [
        {
          url: "https://www.facebook.com/poets.org",
          icon: "FacebookIcon"
        },
        {
          url: "https://twitter.com/POETSorg",
          icon: "TwitterIcon"
        },
        {
          url: "http://poetsorg.tumblr.com/",
          icon: "TumblrIcon"
        },
        {
          url: "https://soundcloud.com/poets-org",
          icon: "SoundcloudIcon"
        },
        {
          url: "https://www.youtube.com/channel/UCMbWrLV3xwKly6vqhnl0IXg",
          icon: "YoutubeIcon"
        },
        {
          url: "#",
          icon: "InstagramIcon"
        },
        {
          url: "https://www.pinterest.com/",
          icon: "PinterestIcon"
        }
      ];
    }
  }
};
</script>
<style lang="scss" scoped>
ul {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: 0;
  justify-content: space-between;

  @include media-breakpoint-up(md) {
    justify-content: flex-start;
  }

  @include media-breakpoint-up(lg) {
    justify-content: space-between;
    flex-wrap: nowrap;
  }

  li {
    @include media-breakpoint-up(md) {
      &:not(:last-child) {
        margin-right: 0.4rem;
      }
    }

    @include media-breakpoint-up(lg) {
      &:not(:last-child) {
        margin-right: 0.6rem;
      }
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

import Vue from "vue";
import { storiesOf } from "@storybook/vue";

import FeaturedPoetsDeck from "../components/FeaturedPoetsDeck";
import poetImage from "../static/images/poet.png";

const bio =
  "Etiam porta sem malesuada magna mollis euismod. Aenean lacinia bibendum nulla sed consectetur. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.";

Vue.component("featured-poets-deck", FeaturedPoetsDeck);

storiesOf("Deck", module).add("Featured Poets", () => ({
  data() {
    return {
      link: {
        href: "test",
        text: "2773 poets"
      },
      cards: [
        {
          name: "Pork chop ground round",
          img: {
            src: poetImage
          },
          link: {
            href: "blah/blah"
          },
          bio: bio
        },
        {
          name: "Short loin",
          img: {
            src: poetImage
          },
          link: {
            href: "blah/blah"
          },
          bio: bio
        },
        {
          name: "Corned Beef ",
          img: {
            src: poetImage
          },
          link: {
            href: "blah/blah"
          },
          bio: bio
        }
      ]
    };
  },
  template: `
    <featured-poets-deck
      title="Featured Poets"
      cardtype= "featured-poet"
      :cards="cards"
      :link="link"
    > </featured-poets-deck>`
}));

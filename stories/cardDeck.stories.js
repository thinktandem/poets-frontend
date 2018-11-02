import Vue from "vue";
import {
  storiesOf
} from "@storybook/vue";

import CardDeck from "../components/CardDeck";
import poetImage from "../static/images/poet.png";

const bio =
  "Etiam porta sem malesuada magna mollis euismod. Aenean lacinia bibendum nulla sed consectetur. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.";

Vue.component("card-deck", CardDeck);

storiesOf("Cards", module).add("Card Deck", () => ({
  data() {
    return {
      link: {
        href: "#",
        text: "2773 poets"
      },
      cards: [{
          name: "Bob Fred",
          img: {
            src: poetImage
          },
          link: {
            href: "blah/blah"
          },
          bio: bio
        },
        {
          name: "Dustin 'Le Kesrue' Le Blanc",
          img: {
            src: poetImage
          },
          link: {
            href: "blah/blah"
          },
          bio: bio
        },
        {
          name: "Mike 'Im not THAT short' Pirog",
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
    <card-deck
      title="Poets"
      cardtype= "poet"
      :cards="cards"
      :link="link"
    ></card-deck>`
}));

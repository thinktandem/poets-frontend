import Vue from "vue";
import { storiesOf } from "@storybook/vue";
import FeaturedPoet from "../components/FeaturedPoet";
import poetImage from "../static/images/poet.png";

const name = "Featured Poet";
const bio =
  "Spicy jalapeno bacon ipsum dolor amet short loin sirloin bacon beef spare ribs.";
Vue.component("featured-poet", FeaturedPoet);

storiesOf("Cards", module).add("FeaturedPoet", () => ({
  data() {
    return {
      img: {
        src: poetImage
      },
      link: {
        href: "blah/blah"
      }
    };
  },
  template: `
    <b-container>
      <b-row>
        <b-col cols="3">
          <featured-poet
            name="${name}"
            :img="img"
            :link="link"
            bio="${bio}"
          > </featured-poet>
        </b-row>
      </b-col>
    </b-container>`
}));

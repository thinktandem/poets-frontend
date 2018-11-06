import Vue from "vue";
import { storiesOf } from "@storybook/vue";

import Poet from "../components/Poet";
import poetImage from "../static/images/poet.png";

const name = "Jose Olivarez";
const bio =
  "Etiam porta sem malesuada magna mollis euismod. Aenean lacinia bibendum nulla sed consectetur. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.";
Vue.component("poet", Poet);

storiesOf("Cards", module).add("Poet", () => ({
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
          <poet
            name="${name}"
            :img="img"
            :link="link"
            bio="${bio}"
          ></poet>
        </b-row>
      </b-col>
    </b-container>`
}));

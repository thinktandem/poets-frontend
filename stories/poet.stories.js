import Vue from "vue";
import { storiesOf } from "@storybook/vue";

import Poet from "../components/Poet";
import poetImage from "../static/images/poet.png";

const name = "Jose Olivarez";
const linkHref = "blah/blah";
const bio =
  "Etiam porta sem malesuada magna mollis euismod. Aenean lacinia bibendum nulla sed consectetur. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.";
Vue.component("poet", Poet);

storiesOf("Poet", module).add("Poet", () => ({
  template: `
    <poet
      name="${name}"
      img_src = "${poetImage}"
      link_href="${linkHref}"
      bio="${bio}"
    ></poet>`
}));

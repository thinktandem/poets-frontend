import Vue from "vue";
import {
  storiesOf
} from "@storybook/vue";

import Poet from "../components/PoetList";

const name = "Jose Olivarez";
const bio =
  "Etiam porta sem malesuada magna mollis euismod. Aenean lacinia bibendum nulla sed consectetur. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.";
Vue.component("poetlist", PoetList);

storiesOf("Cards", module).add("Poet", () => ({
  data() {},
  template: `
    `
}));

import Vue from "vue";
import { storiesOf } from "@storybook/vue";
import AppNavigation from "../components/AppNavigation";

Vue.component("app-navigation", AppNavigation);
storiesOf("Navigation", module).add("Main Nav", () => ({
  template: "<app-navigation></app-navigation>"
}));

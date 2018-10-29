import Vue from "vue";
import { storiesOf } from "@storybook/vue";

import AppHeroOuter from "../components/AppHero/AppHeroOuter";

import bgFile from "../static/hero/bg.png";

const quote =
  "Poetry offers us the capacity to carry in us and express the contradictory impulses that make us human.";
const defaultLead =
  "Find the perfect poems, save them, and share them to your heart’s content.";
Vue.component("app-hero", AppHeroOuter);

storiesOf("Heroes", module)
  .add("Default Hero", () => ({
    template: `
    <app-hero
      variant="default"
      background=${bgFile}
      heading="Find Poems"
      lead="${defaultLead}">
    </app-hero>`
  }))
  .add("Quote Hero", () => ({
    template: `
    <app-hero
      variant='quote'
      background=${bgFile}
      lead="${quote}">
      —Kwame Dawes, Academy of American Poets Chancellor (2018- )
    </app-hero>`
  }));

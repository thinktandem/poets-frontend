import { storiesOf } from "@storybook/vue";
import appNavigation from "../components/AppNavigation";

storiesOf("Navigation", module).add("Main Nav", () => ({
  template: "<app-navigation></app-navigation>",
  components: { appNavigation }
}));

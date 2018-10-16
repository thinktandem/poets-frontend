import { storiesOf } from "@storybook/vue";

const sizes = ["sm", "md", "lg"];
const variants = [
  "default",
  "primary",
  "primary-dark",
  "secondary",
  "success",
  "warning",
  "danger",
  "light",
  "dark",
  "outline-primary",
  "outline-primary-dark",
  "outline-secondary",
  "outline-secondary-dark",
  "outline-success",
  "outline-warning",
  "outline-danger",
  "outline-light",
  "outline-dark",
  "link"
];

const _ = require("lodash");

const permutations = _.flatMap(sizes, size => {
  return _.map(variants, variant => {
    return { size: size, variant: variant };
  });
});

storiesOf("Buttons", module)
  .add("Kitchen Sink", () => ({
    data() {
      return {
        permutations: permutations
      };
    },
    template:
      '<b-container class="pt-4"><h1 class="text-center py-2">Available Button Styles</h1><b-row><b-button class="m-1" v-for="(permutation, index) in permutations" :key="index" :variant="permutation.variant" :size="permutation.size">{{ permutation.size }} {{ permutation.variant }}</b-button></b-row></b-container></div>'
  }))
  .add("Input Button", () => ({
    template: `
<div class="bg-dark">
<b-container class="pt-4">
  <b-row>
    <div class="input-group m-3">
      <input type="email" class="form-control" placeholder="someone@example.com" aria-label="Email Address" aria-describedby="button-addon2">
      <div class="input-group-append">
        <button class="btn btn-secondary" type="button" id="button-addon2">Sign Up</button>
      </div>
    </div>
  </b-row>
</b-container>
</div>
`
  }));

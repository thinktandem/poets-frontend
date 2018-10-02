/* eslint-disable react/react-in-jsx-scope */

import { storiesOf } from "@storybook/vue";

import "../assets/scss/app.scss";
import 'bootstrap-vue/dist/bootstrap-vue.css';

import bMedia from "bootstrap-vue/es/components/media/media";
import bCard from "bootstrap-vue/es/components/card/card";
import bCardGroup from "bootstrap-vue/es/components/card/card-group";
import bImg from "bootstrap-vue/es/components/image/img";

storiesOf("Text", module)
  .add("H1", () => ({
    template: "<h1>H1  /  Roman  Italic  No  2  42</h1>"
  }))
  .add("H2", () => ({
    template: "<h2>h2  /  Roman  Italic  No  2  70</h2>"
  }))
  .add("H3", () => ({
    template: "<h3>h3  /  Roman  Italic  No  2  28</h3>"
  }))
  .add("Display", () => ({
    template: "<p>Display  Small  /  Regular  20</p>"
  }))
  .add("Body Text", () => ({
    template: `
      <div>
        <p class="lead">Heading  /  Semibold  16</p>
        <p class="big">SUBHEADING  /  SEMIBOLD  12</p>
        <p>Body  /  Regular  16</p>
        <figure>
          <figcaption>Caption  /  Regular  12</figcaption>
        </figure>
      </div>`
  }))
  .add("color Palette", () => ({
    template: `
      <div>
        <h4>Color Palette</h4>
        <hr />
        <b-media vertical-align="center">
          <b-img slot="aside" blank blank-color="#00B8E9" width="64" alt="placeholder" />
          <h5 class="mt-0">Primary</h5>
          <p>#00B8E9</p>
        </b-media>
        <b-media vertical-align="center">
          <b-img slot="aside" blank blank-color="#007DAD" width="64" alt="placeholder" />
          <h5 class="mt-0">Primary Dark</h5>
          <p>#007DAD</p>
        </b-media>
        <b-media vertical-align="center">
          <b-img slot="aside" blank blank-color="#FD3C60" width="64" alt="placeholder" />
          <h5 class="mt-0">Secondary</h5>
          <p>#FD3C60</p>
        </b-media>
        <b-media vertical-align="center">
          <b-img slot="aside" blank blank-color="#EF144B" width="64" alt="placeholder" />
          <h5 class="mt-0">Secondary Dark</h5>
          <p>#EF144B</p>
        </b-media>
        <b-media vertical-align="center">
          <b-img slot="aside" blank blank-color="#00CF88" width="64" alt="placeholder" />
          <h5 class="mt-0">Tertiary Green</h5>
          <p>#00CF88</p>
        </b-media>
        <b-media vertical-align="center">
          <b-img slot="aside" blank blank-color="#FF9E50" width="64" alt="placeholder" />
          <h5 class="mt-0">Tertiary Orange</h5>
          <p>#FF9E50</p>
        </b-media>
        <b-media vertical-align="center">
          <b-img slot="aside" blank blank-color="#1E1E1E" width="64" alt="placeholder" />
          <h5 class="mt-0">Black</h5>
          <p>#1E1E1E</p>
        </b-media>
        <b-media vertical-align="center">
          <b-img slot="aside" blank blank-color="#343434" width="64" alt="placeholder" />
          <h5 class="mt-0">Dark Grey</h5>
          <p>#343434</p>
        </b-media>
      </div>`,
    components: { bMedia, bImg, bCard, bCardGroup }
  }));
/* eslint-enable react/react-in-jsx-scope */

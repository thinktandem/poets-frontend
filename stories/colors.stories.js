import { storiesOf } from "@storybook/vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import bMedia from "bootstrap-vue/es/components/media/media";
import bCard from "bootstrap-vue/es/components/card/card";
import bCardGroup from "bootstrap-vue/es/components/card/card-group";
import bImg from "bootstrap-vue/es/components/image/img";

storiesOf("Colors", module).add("Color Palette", () => ({
  template: `
      <div>
        <h4>Color Palette</h4>
        <hr />
        <b-media vertical-align="center">
          <b-img slot="aside" blank blank-color="#00B4F0" width="64" alt="placeholder" />
          <h5 class="mt-0">Primary</h5>
          <p>#00B4F0</p>
        </b-media>
        <b-media vertical-align="center">
          <b-img slot="aside" blank blank-color="#007AB3" width="64" alt="placeholder" />
          <h5 class="mt-0">Primary Dark</h5>
          <p>#007AB3</p>
        </b-media>
        <b-media vertical-align="center">
          <b-img slot="aside" blank blank-color="#F53F5B" width="64" alt="placeholder" />
          <h5 class="mt-0">Secondary</h5>
          <p>#F53F5B</p>
        </b-media>
        <b-media vertical-align="center">
          <b-img slot="aside" blank blank-color="#E61845" width="64" alt="placeholder" />
          <h5 class="mt-0">Secondary Dark</h5>
          <p>#E61845</p>
        </b-media>
        <b-media vertical-align="center">
          <b-img slot="aside" blank blank-color="#32D17E" width="64" alt="placeholder" />
          <h5 class="mt-0">Tertiary Green</h5>
          <p>#32D17E</p>
        </b-media>
        <b-media vertical-align="center">
          <b-img slot="aside" blank blank-color="#FFA02F" width="64" alt="placeholder" />
          <h5 class="mt-0">Tertiary Orange</h5>
          <p>#FFA02F</p>
        </b-media>
        <b-media vertical-align="center">
          <b-img slot="aside" blank blank-color="#1E1E1E" width="64" alt="placeholder" />
          <h5 class="mt-0">Black</h5>
          <p>#1E1E1E</p>
        </b-media>
        <b-media vertical-align="center">
          <b-img slot="aside" blank blank-color="#E6E7E8" width="64" alt="placeholder" />
          <h5 class="mt-0">Grey</h5>
          <p>#E6E7E8</p>
        </b-media>
        <b-media vertical-align="center">
          <b-img slot="aside" blank blank-color="#343434" width="64" alt="placeholder" />
          <h5 class="mt-0">Dark Grey</h5>
          <p>#343434</p>
        </b-media>
      </div>`,
  components: { bMedia, bImg, bCard, bCardGroup }
}));

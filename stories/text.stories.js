import { storiesOf } from "@storybook/vue";

storiesOf("Text", module)
  .add("Fonts", () => ({
    template: `
    <div>
      <div style="font-family: Founders Grotesk">
        <h1>Sans Serif - Founders Grotesk</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lacinia bibendum nulla sed consectetur. Curabitur blandit tempus porttitor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.</p>
      </div>
      <div style="font-family: Poets Electra">
      
        <h1>Serif - Poets Electra</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lacinia bibendum nulla sed consectetur. Curabitur blandit tempus porttitor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.</p>
      </div>
    </div>
  `
  }))
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
  }));

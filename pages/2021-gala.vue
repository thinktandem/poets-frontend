<template>
  <b-container class="py-5">
    <h1>2021 Gala</h1>
    <p>This is text above</p>

    <p>
      <iframe
        allow="accelerometer; autoplay; clipboard-write; encrypted-media;
        gyroscope; picture-in-picture"
        allowfullscreen=""
        frameborder="0"
        height="315"
        src="https://www.youtube.com/embed/Xo9SoLrTfkM"
        title="YouTube video player"
        width="560"/>
    </p>

    <p>this is text below</p>

    <p>&nbsp;</p>

    <p>
      <img
        alt="npm"
        data-entity-type="file"
        data-entity-uuid="f31fd898-21c3-42aa-bc8e-38a5277e7ba4"
        src="/sites/default/files/inline-images/NPM_Generics_ForSocial%20%281%29.png"
        width="800">
    </p>
  </b-container>
</template>

<script>
export default {
  layout: "sparse",
  async fetch({ app, store, params, route, menu }) {
    // Set the current hero
    store.commit("updateHero", {
      heading: "2021 Gala"
    });
  }
};
</script>

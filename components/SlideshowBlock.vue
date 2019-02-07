<template>
  <section
    class="py-5"
    style="background-color: #000;">
    <b-container>
      <b-row class="d-flex flex-column">
        <component
          class="text-white text-center pb-3"
          :is="titleTag">{{ title }}</component>
        <b-carousel
          style="max-width: 860px;"
          id="carousel"
          class="align-self-center"
          controls
          indicators>
          <b-carousel-slide
            v-for="(slide, index) in slides"
            :key="index"
            img-height="485"
            img-width="860"
            :img-src="slide.img.src"
            :img-alt="slide.img.alt"
            :caption="slide.caption"
            :text="slide.text"/>
        </b-carousel>
      </b-row>
    </b-container>
  </section>
</template>
<script>
export default {
  name: "SlideshowBlock",
  props: {
    slides: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: ""
    },
    titleTag: {
      type: String,
      default: "h3"
    }
  }
};
</script>
<style lang="scss">
.carousel {
  .carousel-inner {
    .carousel-caption {
      background-color: rgba(#000, 0.75);
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
    }
  }
  .carousel-control-prev,
  .carousel-control-next {
    align-items: flex-end;
    padding-top: 20px;
    padding-bottom: 20px;
  }
}
</style>

<template>
  <section>
    <component :is="titleTag">{{ title }}</component>
    <b-carousel
      id="carousel"
      controls
      indicators>
      <b-carousel-slide
        v-for="(slide, index) in slides"
        :key="index"
        :img-src="slide.img.src"
        :img-alt="slide.img.alt"
        :caption="slide.caption"
        :text="slide.text"/>
    </b-carousel>
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

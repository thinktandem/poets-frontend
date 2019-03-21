<template>
  <div class="py-4 awards">
    <component
      :is="titleTag"
      class="font-serif awards__title">Awards</component>
    <p
      v-for="award in awards"
      :key="award.img"
      class="awards__image">
      <b-img
        :src="award.img"
        :alt="award.alt" />
    </p>
  </div>
</template>

<script>
export default {
  /**
   * @todo replace with real data/prop
   * @return {{ awards: {img: string}[]}}
   */
  data() {
    return {
      awards: [
        {
          img: "awards/award1.png",
          alt: "The first award"
        },
        {
          img: "awards/award2.png",
          alt: "much prestige"
        }
      ]
    };
  },
  props: {
    titleTag: {
      type: String,
      default: "h3"
    }
  },
  components: {}
};
</script>
<style scoped lang="scss">
.awards {
  // text-align: center;
  background-color: var(--gray-100);
  .awards__title {
    line-height: 2.75rem;
    font-size: 2.65rem;
    text-align: center;
  }
  .awards__image {
    img {
      margin: auto;
      display: block;
      width: 100%;
    }
  }
}

@include media-breakpoint-only(xs) {
  .awards {
    .awards__title {
      text-align: left;
    }
    p {
      img {
        width: 87%;
      }
    }
  }
}
</style>

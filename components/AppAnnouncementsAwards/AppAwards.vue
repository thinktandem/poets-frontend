<template>
  <div class="p-4 awards">
    <h2>Awards</h2>
    <p
      v-for="award in awards"
      :key="award.img"
      class="awards__image"
    >
      <b-img
        :src="award.img"
        :alt="award.alt"
      />
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
  }
};
</script>
<style scoped lang="scss">
.awards {
  // text-align: center;
  background-color: var(--gray-100);

  h2 {
    text-align: center;
  }
}

@include media-breakpoint-only(sm) {
  .awards {
    p {
      img {
        width: 87%;
      }
    }
  }
}
</style>

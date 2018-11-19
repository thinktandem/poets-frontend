<template>
  <b-card
    class="featured-poet"
    itemprop="author"
    itemscope
    itemtype="http://schema.org/Person">
    <b-img
      :src="img.src"
      fluid-grow 
      w-100/>
    <div class="featured-poet__name-bio">
      <h3
        class="featured-poet__name"
        itemprop="name">{{ name }}</h3>
      <div class="featured-poet__bio">
        <p>{{ bio }}</p>
        <a
          :href="link.href"
          class="featured-poet__link">Read More</a>
      </div>
    </div>
  </b-card>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: ""
    },
    bio: {
      type: String,
      default: ""
    },
    img: {
      type: Object,
      default: function() {}
    },
    link: {
      type: Object,
      default: function() {}
    }
  }
};
</script>

<style scoped lang="scss">
.featured-poet {
  margin: 0;
  position: relative;
  overflow: hidden;
  background-color: transparent;
  .card-body {
    padding: 0;

    img {
      padding: 0 4%;
      align-content: center;
      background-color: transparent;
    }
  }

  &__name-bio {
    border-bottom: 3px solid var(--green);
    background-color: var(--white);
    padding: 3%;
  }

  &__name {
    margin: 0;
    padding: 1rem;
    background-color: var(--white);
    font-family: "Poets Electra";
    font-size: 1.75rem;
    font-style: italic;
    color: var(--gray-900);
  }

  &__bio {
    font-size: 1.25rem;
    line-height: 1.85rem;
    font-family: "Poets Electra";
    padding: 1% 8% 8%;
  }

  &__link {
    color: var(--blue-dark);
    padding: 4% 0 2%;
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.5rem;
    text-decoration: none;
    font-family: "Founders Grotesk Text";

    &::after {
      color: var(--green);
      content: " >";
    }
  }
}
</style>

<template>
  <b-card
    class="poet"
    itemprop="author"
    itemscope
    itemtype="http://schema.org/Person">
    <b-img
      :src="img.src"
      fluid-grow />
    <div class="poet__name-bio">
      <h3
        class="poet__name"
        itemprop="name">
        {{ name }}
      </h3>
      <div class="poet__bio">
        <p>{{ bio }}</p>
        <a
          :href="link.href"
          class="poet__link">Read more about {{ name }}</a>
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
.poet {
  margin: 0;
  position: relative;
  overflow: hidden;
  border: none;

  .card-body {
    padding: 0;
  }

  &__name-bio {
    position: absolute;
    top: calc(100% - 3.7rem);
    bottom: 0;
    left: 0;
    right: 0;
    transition: top 0.25s ease-in-out;
    display: flex;
    flex-direction: column;

    &:hover,
    &:focus,
    &:active {
      top: 0;
    }
  }

  &__name {
    margin: 0;
    padding: 1rem;
    background-color: var(--gray-darkest);
    border-bottom: 3px solid var(--green);
    font-size: 1.25rem;
    color: var(--white);
    opacity: 0.9;
  }

  &__bio {
    flex-grow: 1;
    padding: 1rem;
    color: var(--white);
    background-color: var(--gray-800);
    overflow: scroll;
  }

  &__link {
    color: var(--white);
    font-weight: 700;
    text-decoration: underline;

    &::after {
      content: " >";
    }

    &:hover,
    &:focus,
    &:active {
      color: var(--white);
    }
  }
}
</style>

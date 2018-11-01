<template>
  <article class="poet" itemprop="author" itemscope itemtype="http://schema.org/Person">
    <b-img :src="img_src" fluid />
    <div class="poet__name-bio">
      <h2 class="poet__name" itemprop="name">{{ name }}</h2>
      <div class="poet__bio">
        <p>{{ bio }}</p>
        <a :href="link_href" class="poet__link">Read more about {{ name }}</a>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  components: {},
  props: ["name", "img_src", "bio", "link_href"]
};
</script>

<style scoped lang="scss">
.poet {
  width: 300px;
  height: 300px;
  position: relative;
  overflow: hidden;

  &__name-bio {
    position: absolute;
    top: calc(100% - 3.7rem);
    transition: top 0.25s ease-in-out;

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
    color: var(--white);
    background-color: var(--gray-800);

    p {
      padding: 1rem;
    }
  }

  &__link {
    color: var(--white);
  }
}
</style>

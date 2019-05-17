<template>
  <b-card
    class="poet"
    itemprop="author"
    itemscope
    itemtype="http://schema.org/Person">
    <b-link :to="link">
      <b-img-lazy
        :src="img.src"
        :alt="img.alt"
        blank-color="#000"
        fluid-grow/>
    </b-link>
    <div
      class="poet__name-bio"
    >
      <h3
        class="poet__name"
        itemprop="name"
      >
        <b-link
          :to="link"
          class="text-white">
          {{ name }}
        </b-link>
      </h3>
    </div>
  </b-card>
</template>

<script>
import AppTeaserText from "~/components/AppTeaserText";
export default {
  name: "Poet",
  components: { AppTeaserText },
  data() {
    return {
      showDetails: false
    };
  },
  props: {
    name: {
      type: String,
      default: ""
    },
    img: {
      type: Object,
      default: null
    },
    link: {
      type: String,
      default: "#"
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
  background-color: var(--gray-darkest);

  .card-body {
    padding: 0;
  }

  .empty-div {
    min-height: 384px;
    min-width: 388px;
    background-color: var(--gray-900);
  }

  &__name-bio {
    position: absolute;
    top: calc(100% - 3.65rem);
    bottom: 0;
    left: 0;
    right: 0;
    transition: top 0.25s ease-in-out;
    display: flex;
    flex-direction: column;
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

  &__link {
    color: var(--white);
    font-weight: 700;

    &::after {
      content: " >";
    }
  }
}
</style>

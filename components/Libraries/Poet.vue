<template>
  <b-card
    class="poet"
    itemprop="author"
    itemscope
    itemtype="http://schema.org/Person"
  >
    <a
      @click="toggleDetails"
    >
      <b-img-lazy
        :src="img.src"
        :alt="img.alt"
        blank-color="#000"
        fluid-grow
      />
    </a>
    <div
      :class="detailClass"
      class="poet__name-bio">
      <h3
        class="poet__name"
        itemprop="name"
      >
        <a
          class="text-white"
          @click="toggleDetails">{{ name }}</a>
      </h3>
      <div class="poet__bio">
        <app-teaser-text
          :text="bio"
        />
        <a
          :href="link"
          class="poet__link"
        >Read more about {{ name }}</a>
      </div>
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
  methods: {
    toggleDetails() {
      this.showDetails = !this.showDetails;
    }
  },
  computed: {
    detailClass() {
      return this.showDetails ? "show-details" : "";
    }
  },
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
.poet__name-bio:hover,
.poet__name-bio:active,
.poet__name-bio:focus,
.show-details.poet__name-bio {
  top: 0;
}
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

  &__bio {
    flex-grow: 1;
    padding: 1rem;
    color: var(--white);
    background-color: var(--gray-800);
    font-weight: 400;
    overflow: scroll;
  }

  &__link {
    color: var(--white);
    font-weight: 700;

    &::after {
      content: " >";
    }

    &:hover,
    &:focus,
    &:active {
      color: var(--white);
      text-decoration: underline;
    }
  }
}
</style>

<template>
  <div class="hero-search">
    <b-form
      class="hero-search__form"
      @submit.stop.prevent="search">
      <b-form-group
        label="search"
        label-sr-only
        label-for="heroSearchInput">
        <b-input-group>
          <b-form-input
            type="text"
            v-model="searchInput"
            placeholder="search"
            class="hero-search__form-input"/>
          <b-input-group-append is-text>

            <magnifying-glass-icon
              class="icon mr-2"/>

          </b-input-group-append>
        </b-input-group>
      </b-form-group>
      <b-list-group
        class="hero__search__links">
        <b-list-group-item
          v-for="(link, index) in links"
          :key="index"
          :to="link.to"
          class="hero__search__link">
          {{ link.text }}
        </b-list-group-item>
      </b-list-group>
    </b-form>
  </div>
</template>

<script>
// import searchHelpers from "~/plugins/search-helpers";
import MagnifyingGlassIcon from "~/node_modules/open-iconic/svg/magnifying-glass.svg";
export default {
  components: {
    MagnifyingGlassIcon
  },
  props: {
    links: {
      type: Array,
      default() {
        return [
          {
            to: {
              name: "vertical-poem",
              params: { vertical: "poetsorg" }
            },
            text: "find poems"
          },
          {
            to: {
              name: "vertical-poet",
              params: { vertical: "poetsorg" }
            },
            text: "find poets"
          },
          {
            to: {
              name: "vertical-poet",
              params: { vertical: "poetsorg" }
            },
            text: "poem-a-day"
          },
          {
            to: {
              name: "vertical-poet",
              params: { vertical: "poetsorg" }
            },
            text: "library (texts, books, & more)"
          },
          {
            to: {
              name: "vertical-poet",
              params: { vertical: "poetsorg" }
            },
            text: "materials for teachers"
          },
          {
            to: {
              name: "vertical-poet",
              params: { vertical: "poetsorg" }
            },
            text: "poetry near you"
          }
        ];
      }
    }
  },
  data() {
    return {
      searchInput: ""
    };
  },
  methods: {
    search() {
      this.$router.push({
        name: "search",
        query: { combine: this.searchInput }
      });
    }
  }
};
</script>

<style scoped lang="scss">
::placeholder {
  color: rgba(white, 0.5);
}

.form-group {
  margin-bottom: 0;
}

.icon {
  fill: $blue;
  width: 1.4rem;
  height: 1.4rem;
}

.input-group {
  border-bottom: 2px solid transparent;
}

.input-group-append {
  margin-left: 0;
}

.input-group-text {
  background-color: rgba($gray-800, 0.9);
  font-size: 1.5rem;
  line-height: 1.6rem;
  border: none;
  border-radius: 0;
}

.hero-search__form-input {
  // gray-800
  background-color: rgba($gray-800, 0.9);
  color: rgba($white, 0.5);
  font-size: 1.25rem;
  line-height: 1.6rem;
  padding: 1.5rem 1.25rem;
  border: none;
  &:focus {
    color: rgba($white, 0.5);
    background-color: rgba($gray-800, 0.9);
  }
}
.hero__search__links {
  background-color: var(--gray-900);
  padding-top: 0.7rem;
  padding-bottom: 1rem;
}

.hero__search__link {
  background-color: var(--gray-900);
  border-radius: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--white);

  &.active,
  &:hover {
    background-color: var(--black);
    color: var(--blue);
  }
}
</style>

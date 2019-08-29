<template>
  <div class="hero-search d-flex flex-column flex-fill">
    <app-form
      class="hero-search__form"
      @submit="search">
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
          <b-input-group-append>
            <b-button
              class="hero-search__form-button"
              type="submit">
              <magnifying-glass-icon
                class="icon mr-2"/>
            </b-button>

          </b-input-group-append>
        </b-input-group>
      </b-form-group>
    </app-form>
    <b-list-group
      class="hero__search__links d-none d-md-flex flex-fill">
      <b-list-group-item
        v-for="(link, index) in $store.state.midMenu"
        :key="index"
        :href="link.to"
        class="hero__search__link">
        {{ link.text }}
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
import MagnifyingGlassIcon from "~/node_modules/open-iconic/svg/magnifying-glass.svg";
export default {
  components: {
    MagnifyingGlassIcon
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

.hero-search__form-button {
  background-color: rgba($gray-800, 0.9) !important;
  border: none;
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

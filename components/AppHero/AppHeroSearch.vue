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
            class="hero-search__form-input px-3 pt-3 pb-2"/>
          <b-input-group-append is-text>
            <span class="text-primary oi oi-magnifying-glass"/>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>
      <b-list-group
        class="hero__search__links">
        <b-list-group-item
          v-for="search in searches"
          :key="search.link"
          class="hero__search__link">
          <a :href="search.link">
            {{ search.text }}
          </a>
        </b-list-group-item>
      </b-list-group>
    </b-form>
  </div>
</template>

<script>
// import searchHelpers from "~/plugins/search-helpers";
export default {
  /**
   * @todo: should/can this be a data/prop delivered by drupal?
   * @return {{ quotes: {quote: string, attribution: string}[]}}`
   */
  data() {
    return {
      searches: [
        {
          link: "/programs",
          text: "programs"
        },
        {
          link: "/prizes",
          text: "prizes"
        },
        {
          link: "/leadership-and-staff",
          text: "leadership & staff"
        },
        {
          link: "/mission-and-history",
          text: "mission & history"
        },
        {
          link: "/poetry-coalition",
          text: "poetry coalition"
        },
        {
          link: "/about-us",
          text: "about us"
        },
        {
          link: "/announcements",
          text: "announcements"
        }
      ],
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

.input-group {
  border-bottom: 2px solid transparent;
}

.input-group-append {
  margin-left: 0;
}

.input-group-text {
  // gray-800
  background-color: rgba(#343434, 0.9);
  font-size: 1.5rem;
  line-height: 1.6rem;
  border: none;
  border-radius: 0;
}

.hero-search__form-input {
  // gray-800
  background-color: rgba(#343434, 0.9);
  font-size: 1.25rem;
  line-height: 1.6rem;
  border: none;
}
.hero__search__links {
  background-color: var(--gray-900);
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

.hero__search__link {
  background-color: var(--gray-900);
  border-radius: 0;
  font-size: 20px;
  font-weight: 600;

  a {
    color: var(--white);
  }

  &:hover {
    background-color: var(--black);
    a {
      text-decoration: none;
      color: var(--blue);
    }
  }
}
</style>

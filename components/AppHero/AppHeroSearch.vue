<template>
  <div class="hero-search">
    <form class="hero-search__form">
      <label class="sr-only">search</label>
      <input
        type="text"
        placeholder="search"
        class="hero-search__form-input form-control">
    </form>
    <div
      v-for="search in searches"
      :key="search.link"
      class="hero-search__links pt-1 pb-1 pl-3">
      <a :href="search.link">
        {{ search.text }}
      </a>
    </div>
  </div>
</template>

<script>
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
      ]
    };
  }
};
</script>

<style scoped lang="scss">
.hero-search {
  background-color: var(--gray-900);
  width: 361px;
  form {
    border-bottom: 3px solid var(--blue);
    .hero-search__form-input {
      background-color: var(--gray-800);
      border: none;
      height: 42px;
      background-image: url(/images/search.jpg);
      background-repeat: no-repeat;
      background-size: 41px;
      background-position: right;
    }
  }
  .hero-search__links {
    font-size: 20px;
    font-weight: 600;
    a {
      color: var(--white);
    }
    a:hover {
      text-decoration: none;
    }
  }
}
.hero-search:hover {
  background-color: var(--black);
}
</style>

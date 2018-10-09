<template>
  <div class="hero-search">
    <form class="mb-1">
      <input
        type="text"
        placeholder="search"
        class="form-control">
    </form>
    <div
      v-for="search in searches"
      :key="search.link"
      class="hero-search__links p-2">
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
  background-color: var(--black);
  form {
    border-bottom: 3px solid var(--blue);
    input {
      background-color: var(--gray-800);
    }
  }
  .hero-search__links {
    font-size: 20px;
    a {
      color: var(--white);
    }
  }
}
</style>

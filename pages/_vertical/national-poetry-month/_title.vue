<template>
  <div>
    <b-container class="pt-5">
      <b-row>
        <b-col
          class="pb-5"
          offset-md="1"
          md="7"
        >
          ... gff ...
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  async asyncData({ app, params, env }) {
    return {};
  },
  async fetch({ app, store, params }) {},
  methods: {
    buildSectionLink(response, query = {}) {
      return _.has(response, "meta.count") && response.meta.count > 3
        ? {
            to: {
              name: "vertical-poem",
              query: query
            },
            text: `${response.meta.count} Poems`
          }
        : null;
    }
  }
};
</script>

<style scoped lang="scss">
.poem__title {
  flex-direction: row;
  justify-content: space-between;
}
.poem__soundcloud-link {
  color: var(--blue-dark);
  fill: var(--blue-dark);
  font-size: 1.9rem;
  width: 1.9rem;
  height: 1.9rem;
}

.card--main {
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.05), 0 4px 0 0 #32d17e;
  .card-title {
    font-size: 2.5rem;
  }

  .card-subtitle {
    font-family: $font-family-sans-serif;
    font-size: 1.25rem;
    line-height: 1.75rem;
    color: var(--black);
  }

  .card-body {
    font-size: 1.25rem;
    line-height: 1.87rem;
    font-family: $font-family-serif;
  }
  .card--poem__attribution {
    font-size: 0.8rem;
    line-height: 1.25rem;
  }
}

.poet--aside__image {
  border-bottom: 5px solid $green;
  img {
    width: 100%;
  }
}
.poet--aside__bio {
  font-size: 0.9rem;
  line-height: 1.07rem;
}
@include media-breakpoint-up(md) {
  .poem__actions {
    left: -3rem;
  }
}
</style>

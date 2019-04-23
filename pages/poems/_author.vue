<template>
  <div>
    <b-container md="8">
      <h3 class="poems-by__title">
        {{ poet.data.attributes.title }}
      </h3>
    </b-container>
    <b-container class="poems-list tabular-list">
      <b-row class="tabular-list__row tabular-list__header">
        <b-col md="4">
          Name
        </b-col>
        <b-col md="4">
          Author
        </b-col>
        <b-col md="4">
          Year
        </b-col>
      </b-row>
      <b-row
        v-for="poem in poems"
        class="tabular-list__row poems-list__poems"
        :key="poem.id">
        <b-col md="4">
          <a
            v-if="poem.attributes.path"
            :href="poem.attributes.path.alias"
            v-html="replaceFileUrl(poem.attributes.title)"/>
        </b-col>
        <b-col md="4">
          {{ poet.data.attributes.title }}
        </b-col>
        <b-col md="4">
          {{ poem.attributes.field_date_published }}
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import qs from "qs";
import iconMediaSkipBackwards from "~/static/icons/media-skip-backwards.svg";
import iconMediaSkipForwards from "~/static/icons/media-skip-forwards.svg";
import MagnifyingGlassIcon from "~/node_modules/open-iconic/svg/magnifying-glass.svg";

export default {
  components: {
    iconMediaSkipBackwards,
    iconMediaSkipForwards,
    MagnifyingGlassIcon
  },
  data() {
    return {
      combinedInput: null,
      results: null,
      Next: null,
      Prev: null,
      preparedCombine: null,
      author: null
    };
  },
  async asyncData({ app, params, query, route }) {
    const poet = await app.$axios
      .$get(`/router/translate-path?path=/poet/${params.author}`)
      .then(async res => {
        return app.$axios.$get(`/api/node/person/${res.entity.uuid}`);
      })
      .catch(error => {
        console.error(error);
      });
    const poemsByParams = qs.stringify({
      filter: {
        status: 1,
        "field_author.id": poet.data.id
      }
    });
    const poems = await app.$axios.$get(`/api/node/poems?${poemsByParams}`);

    return {
      poet,
      poems: poems.data
    };
  },
  methods: {
    applyFilters() {
      let myQuery = {};
      if (this.combinedInput) {
        myQuery.combine = this.combinedInput;
      }
      this.$router.push({
        name: "poems",
        query: myQuery
      });
    }
  },
  watchQuery: true
};
</script>

<style scoped lang="scss">
.poems-by__title {
  margin-top: 26px;
  font-size: 2.4rem;
}
.tabular-list__header {
  font-weight: 600;
}
.poems-list__poems {
  font-weight: 400;
  a {
    color: $body-color;

    &:hover,
    &:focus,
    &:active {
      text-decoration: underline;
    }
  }
}

.poems-list {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.poems-list__search {
  margin-top: 2rem;
}

.legend-selects {
  display: flex;
  flex-basis: 100%;
  padding: 1rem 1rem 1rem 2rem;
  border-right: $form__border;

  select {
    &:not(:last-child) {
      margin-right: 1rem;
    }
  }
}

.poems-list__filters__legend {
  flex-basis: 50%;

  legend {
    margin: 0;
    line-height: 2;
    font-size: $font-size-base;
    color: $gray-700;
  }
}

.poems-list__input--search {
  flex-basis: 100%;
  padding: 1rem;
  position: relative;

  input {
    border: none;
    background-color: transparent;

    &:hover,
    &:focus,
    &:active {
      border: none;
      background-color: transparent;
    }

    &::placeholder {
      color: $gray-700;
    }
  }

  button {
    width: 2rem;
    height: 2rem;
    display: flex;
    padding: 0;
    justify-content: center;
    position: absolute;
    top: 50%;
    right: 1rem;
    transform: translateY(-50%);
    background-color: transparent;
    border: none;

    &:hover,
    &:focus,
    &:active,
    &:active:focus {
      // Some really sticky rules getting applied from BS that need a bit of
      // force.
      background-color: transparent !important;
      box-shadow: none !important;
    }

    svg {
      width: 100%;
      height: 100%;
    }
  }
}
.icon {
  display: inline;
  fill: $blue;
  width: 1.4rem;
  height: 1.4rem;
}
.input-group-text {
  background: transparent;
  border: none;
}
</style>

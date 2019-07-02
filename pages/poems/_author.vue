<template>
  <div>
    <b-container md="8">
      <h3 class="poems-by__title">
        {{ poet.data.attributes.title }}
      </h3>
    </b-container>
    <b-container class="table-container">
      <b-table
        id="poems"
        :items="poems"
        :fields="fields"
        stacked="md"
        paged=false>
        <template
          slot="title"
          slot-scope="data"
        >
          <b-link
            v-if="data.item.attributes.path"
            :to="data.item.attributes.path.alias"
            v-html="data.item.attributes.title"/>
          <div
            v-else
            v-html="data.item.attributes.title"/>
        </template>
        <template
          slot="field_author"
          slot-scope="data">
          <b-link :href="poet.data.attributes.path.alias">
            {{ poet.data.attributes.title }}
          </b-link>
        </template>
        <template
          slot="field_date_published"
          slot-scope="data">
          <div
            v-html="niceDate(data.item.attributes.field_date_published, 'year')"/>
        </template>
      </b-table>
    </b-container>
  </div>
</template>

<script>
import _ from "lodash";
import qs from "qs";
import iconMediaSkipBackwards from "~/static/icons/media-skip-backwards.svg";
import iconMediaSkipForwards from "~/static/icons/media-skip-forwards.svg";
import MagnifyingGlassIcon from "~/node_modules/open-iconic/svg/magnifying-glass.svg";
import MetaTags from "~/plugins/metatags";
import niceDate from "~/plugins/niceDate";

export default {
  components: {
    iconMediaSkipBackwards,
    iconMediaSkipForwards,
    MagnifyingGlassIcon
  },
  head() {
    const poetName = this.poet.data.attributes.title;
    this.poet.data.attributes.metatag_normalized.forEach(function(item, index) {
      if (item.attributes.name === "title") {
        this.metatag_normalized[index].attributes.content =
          'Poems by "' + this.title + '"';
      } else if (item.attributes.name === "description") {
        this.metatag_normalized[
          index
        ].attributes.content = `A list of poems by ${poetName}`;
      }
    }, this.poet.data.attributes);
    return MetaTags.renderTags(
      this.$route,
      this.poet.data.attributes.metatag_normalized
    );
  },
  data() {
    return {
      combinedInput: null,
      results: null,
      Next: null,
      Prev: null,
      preparedCombine: null,
      author: null,
      fields: [
        {
          key: "title",
          label: "Title"
        },
        {
          key: "field_author",
          label: "Author"
        },
        {
          key: "field_date_published",
          label: "Year"
        }
      ]
    };
  },
  async asyncData({ app, params, query, route, redirect }) {
    let name = params.author;
    let path = "/poet/" + name;
    if (!isNaN(params.author)) {
      const personParams = qs.stringify({
        filter: {
          nid: {
            path: "nid",
            operator: "=",
            value: params.author
          },
          status: 1
        },
        page: {
          limit: 1
        }
      });
      name = await app.$axios
        .$get(`api/node/person?${personParams}`)
        .catch(err => app.handleError(err))
        .then(res => {
          if (_.isEmpty(res.data)) {
            return app.handleError({ response: { status: 404 } });
          }
          return (
            "/poems/" +
            _.get(res, "data[0].attributes.path.alias").split("/")[2]
          );
        })
        .catch(err => console.log(err));
      path = name;
      return redirect([301], path);
    }
    const poet = await app.$axios
      .$get(`/router/translate-path?path=${path}`)
      .catch(err => app.handleError(err))
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
    },
    niceDate(date, format) {
      return niceDate.niceDate(date, format);
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

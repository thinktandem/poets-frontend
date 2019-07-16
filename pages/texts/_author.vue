<template>
  <div>
    <b-container md="8">
      <h3 class="texts-by__title">
        {{ poet.data.attributes.title }}
      </h3>
    </b-container>
    <b-container class="table-container">
      <b-table
        id="texts"
        :items="texts"
        :fields="fields"
        stacked="md"
        paged=false>
        <template
          slot="title"
          slot-scope="data"
        >
          <a
            :href="data.item.attributes.path.alias"
            v-html="data.item.attributes.title"
          />
        </template>
        <template
          slot="subject"
          slot-scope="data">
          <a
            class="texts-by-author__table-link"
            :href="poet.data.attributes.path.alias">
            {{ poet.data.attributes.title }}
          </a>
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
import qs from "qs";
import MetaTags from "~/plugins/metatags";
import niceDate from "~/plugins/niceDate";

export default {
  components: {},
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
          key: "subject",
          label: "Subject"
        },
        {
          key: "field_date_published",
          label: "Year"
        }
      ]
    };
  },
  head() {
    // Overrides title & description since the overrides doesnt work right.
    this.poet.data.attributes.metatag_normalized.forEach(function(item, index) {
      if (item.attributes.name === "title") {
        this.metatag_normalized[index].attributes.content = `Texts about ${
          this.title
        }`;
      } else if (item.attributes.name === "description") {
        this.metatag_normalized[
          index
        ].attributes.content = `A list of texts by ${this.title}`;
      }
    }, this.poet.data.attributes);
    return MetaTags.renderTags(
      this.$route,
      this.poet.data.attributes.metatag_normalized
    );
  },
  async asyncData({ app, params, query, route, error }) {
    const poet = await app.$axios
      .$get(`/router/translate-path?path=/poet/${params.author}`)
      .catch(err => {
        error({ statusCode: 404, message: "" });
      })
      .then(async res => {
        return app.$axios.$get(`/api/node/person/${res.entity.uuid}`);
      })
      .catch(error => {
        console.error(error);
      });
    const textsByParams = qs.stringify({
      filter: {
        status: 1,
        "field_poets_as_subject.id": poet.data.id
      }
    });
    const texts = await app.$axios.$get(`/api/node/texts?${textsByParams}`);

    return {
      poet,
      texts: texts.data
    };
  },
  methods: {
    niceDate(date, format) {
      return niceDate.niceDate(date, format);
    }
  }
};
</script>

<style scoped lang="scss">
.texts-by__title {
  margin-top: 26px;
  font-size: 2.4rem;
}
.tabular-list__header {
  font-weight: 600;
}
.texts-list__texts {
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

.texts-list {
  padding-top: 3rem;
  padding-bottom: 3rem;
}
.texts-by-author__table-link {
  font-weight: 400;
  color: var(--dark);
}
</style>

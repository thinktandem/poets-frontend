<template>
  <div>
    <b-container class="py-5">
      <b-row>
        <b-col md="8">
          <span class="person__type">Contributor</span>
          <h1 v-if="person.attributes.title">{{ person.attributes.title }}</h1>
        </b-col>
      </b-row>
      <b-row>
        <b-col
          v-if="!empty(body)"
          v-html="replaceFileUrl(body)"
          class="book__body"
          md="8"/>
        <b-col md="4">
          <div
            v-if="!empty(image)">
            <b-img-lazy
              class="person__image"
              fluid
              center
              :src="image.src"
              :alt="image.alt"/>
          </div>
        </b-col>
      </b-row>
      <b-row class="py-5">
        <b-col>
          <app-listing
            title="Texts"
            hide-empty
            class="py-3"
            :default-params="defaultParams"
            :fields="fields"
            :includes="includes"
            resource-type="texts"/>
          <app-listing
            title="Collections"
            hide-empty
            class="py-3"
            :default-params="defaultParams"
            :fields="fields"
            :includes="includes"
            resource-type="collections"/>
          <app-listing
            title="Lesson Plans"
            hide-empty
            class="py-3"
            :default-params="defaultParams"
            :fields="fields"
            :includes="includes"
            resource-type="lesson_plans"/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import AppListing from "~/components/AppListing";
import niceDate from "~/plugins/niceDate";
import { get } from "lodash";
import MetaTags from "~/plugins/metatags";

export default {
  components: { AppListing },
  head() {
    return MetaTags.renderTags(this.person.attributes.metatag_normalized);
  },
  computed: {
    body() {
      return get(this.person, "attributes.body.processed");
    },
    defaultParams() {
      return {
        filter: {
          "field_contributors.id": this.person.id
        }
      };
    }
  },
  data() {
    return {
      fields: {
        field_date_published: {
          label: "Year"
        },
        title: { label: "Title" }
      },
      includes: {},
      sort: "field_date_published"
    };
  },
  async asyncData({ app, params }) {
    return app.$axios
      .get(
        `/router/translate-path?path=/academy-american-poets/contributor/${
          params.title
        }`
      )
      .catch(err => {
        app.handleError(err);
      })
      .then(res => {
        return app.$axios
          .get(`/api/node/person/${res.data.entity.uuid}?include=field_image`)
          .then(res => {
            const image = app.$buildImg(
              res.data,
              null,
              "field_image",
              "poem_a_day_portrait"
            );

            return {
              node: res.data,
              person: res.data.data,
              image
            };
          })
          .catch(error => {
            console.log(error);
          });
      });
  },
  async fetch({ app, store, params }) {
    return app.$buildBasicPage(app, store, "/leadership-staff");
  },
  methods: {
    niceDate(date) {
      return niceDate.niceDate(date);
    }
  }
};
</script>

<style scoped lang="scss">
.person__type {
  text-transform: uppercase;
  font-weight: 600;
  font-size: 16px;
  color: var(--red-dark);
}
.book__body {
  font-weight: 400;
  font-size: 1.2em;
}
.person__image {
  box-shadow: 0 6px 0 0 #ffa02f;
}

@include media-breakpoint-up(md) {
  .col-md-4 .person__image {
    position: relative;
    top: -94px;
  }
}
.person__related-texts-title {
  font-style: italic;
  font-family: "Poets Electra";
  font-size: 30px;
}
.tabular-list__header {
  background-color: #f2f8fa;
  text-transform: uppercase;
  font-weight: 560;
}
.tabular-list__row > div {
  height: inherit;
}
.tabular-list .tabular-list__row > div:last-child {
  text-align: left;
}
.date {
  color: var(--red-dark);
}
.books-list__books-title {
  min-height: 88px;
}
.books-list__books-title a {
  color: var(--gray-800);
  font-weight: 560;
}
.books-list {
  padding-top: 3rem;
  padding-bottom: 3rem;
}
</style>

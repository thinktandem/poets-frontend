<template>
  <div>
    <b-container class="py-5">
      <b-row>
        <b-col md="8">
          <span class="person__type">Contributor</span>
          <h1>{{ person.attributes.title }}</h1>
        </b-col>
      </b-row>
      <b-row>
        <b-col
          v-html="replaceFileUrl(person.attributes.body.processed)"
          class="book__body"
          md="8"/>
        <b-col md="4">
          <div class="person__image">
            <b-img
              :src="image.src"
              :alt="image.alt"/>
          </div>
        </b-col>
      </b-row>
      <b-row
        class="person__related-texts-rows"
        md="8">
        <b-container
          class="books-list tabular-list"
          v-if="relatedTexts.length !== 0">
          <b-row>
            <b-col md="12">
              <h3 class="person__related-texts-title">Texts</h3>
            </b-col>
          </b-row>
          <b-row
            class="tabular-list__row tabular-list__header">
            <b-col
              md="4">
              Date
            </b-col>
            <b-col md="8">
              Title
            </b-col>
          </b-row>
          <b-row
            v-for="text in relatedTexts"
            class="tabular-list__row books-list__books"
            :key="text.attributes.id"
          >
            <b-col
              class="date"
              md="4"
            >
              {{ niceDate(text.attributes.field_date_published) }}
            </b-col>
            <b-col
              class="books-list__books-title"
              md="8">
              <a
                :href="text.attributes.path.alias"
                v-html="replaceFileUrl(text.attributes.title)"
              />
            </b-col>
          </b-row>
        </b-container>
      </b-row>
      <b-row
        class="person__related-texts-rows"
        md="8">
        <b-container
          class="books-list tabular-list"
          v-if="relatedLP.length !== 0">
          <b-row>
            <b-col md="12">
              <h3 class="person__related-texts-title">Lesson Plans</h3>
            </b-col>
          </b-row>
          <b-row
            class="tabular-list__row tabular-list__header">
            <b-col
              md="4">
              Date
            </b-col>
            <b-col md="8">
              Title
            </b-col>
          </b-row>
          <b-row
            v-for="lp in relatedLP"
            class="tabular-list__row books-list__books"
            :key="lp.attributes.id"
          >
            <b-col
              class="date"
              md="4"
            >
              {{ niceDate(lp.attributes.field_date_published) }}
            </b-col>
            <b-col
              class="books-list__books-title"
              md="8">
              <a
                :href="lp.attributes.path.alias"
                v-html="replaceFileUrl(lp.attributes.title)"
              />
            </b-col>
          </b-row>
        </b-container>
        <b-container
          class="books-list tabular-list"
          v-if="relatedAnnouncements.length !== 0">
          <b-row>
            <b-col md="12">
              <h3 class="person__related-texts-title">Announcements</h3>
            </b-col>
          </b-row>
          <b-row
            class="tabular-list__row tabular-list__header">
            <b-col
              md="4">
              Date
            </b-col>
            <b-col md="8">
              Title
            </b-col>
          </b-row>
          <b-row
            v-for="ann in relatedAnnouncements"
            class="tabular-list__row books-list__books"
            :key="ann.attributes.id"
          >
            <b-col
              class="date"
              md="4"
            >
              {{ niceDate(ann.attributes.changed) }}
            </b-col>
            <b-col
              class="books-list__books-title"
              md="8">
              <a
                :href="ann.attributes.path.alias"
                v-html="replaceFileUrl(ann.attributes.title)"
              />
            </b-col>
          </b-row>
        </b-container>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import qs from "qs";
import niceDate from "~/plugins/niceDate";
import MetaTags from "~/plugins/metatags";

export default {
  head() {
    return MetaTags.renderTags(this.person.attributes.metatag_normalized);
  },
  async asyncData({ app, params }) {
    const attributes = await app.$axios
      .get(
        `/router/translate-path?path=/academy-american-poets/contributor/${
          params.title
        }`
      )
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
            this.$sentry.captureException(error);
          });
      });

    const relatedTextsParams = qs.stringify({
      filter: {
        // Only published.
        status: 1,
        // Author is this person.
        "field_contributors.id": attributes.person.id
      }
    });

    const relatedTexts = await app.$axios.$get(
      `/api/node/texts?${relatedTextsParams}`
    );

    const relatedLPParams = qs.stringify({
      filter: {
        // Only published.
        status: 1,
        // Author is this person.
        "field_contributors.id": attributes.person.id
      }
    });

    const relatedLP = await app.$axios.$get(
      `/api/node/lesson_plans?${relatedLPParams}`
    );

    const relatedAnnouncementsParams = qs.stringify({
      filter: {
        // Only published.
        status: 1,
        "field_story_type.tid": 8
      },
      sort: {
        created: {
          path: "created",
          direction: "DESC"
        }
      },
      page: {
        limit: 3
      }
    });

    const relatedAnnouncements = await app.$axios.$get(
      `/api/node/basic_page?${relatedAnnouncementsParams}`
    );

    return {
      person: attributes.person,
      image: attributes.image,
      relatedTexts: relatedTexts.data,
      relatedLP: relatedLP.data,
      relatedAnnouncements: relatedAnnouncements.data
    };
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
  width: 311px;
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

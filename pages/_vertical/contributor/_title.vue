<template>
  <div>
    <b-container class="py-5">
      <b-row>
        <b-col xl="8">
          <span class="person__type">Contributor</span>
          <h1>{{ person.attributes.title }}</h1>
        </b-col>
      </b-row>
      <b-row>
        <b-col
          v-html="person.attributes.body.processed"
          class="book__body"
          xl="8"/>
        <b-col xl="4">
          <div class="person__image">
            <b-img
              :src="image.src"
              :alt="image.alt"/>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  async asyncData({ app, params }) {
    const attributes = await app.$axios
      .get(
        `/router/translate-path?path=${params.vertical}/contributor/${
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
          .catch(err => {
            console.log(err);
          });
      });

    return {
      person: attributes.person,
      image: attributes.image,
      node: attributes.node
    };
  },
  async fetch({ app, store, params }) {
    return app.$buildBasicPage(app, store, "/leadership-staff");
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

@include media-breakpoint-up(xl) {
  .col-xl-4 .person__image {
    position: relative;
    top: -94px;
  }
}
</style>

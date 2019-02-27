<template>
  <div>
    {{ image }}
    <b-container class="py-5">
      <!-- <b-row>
        <b-col xl="8">
          <h1>{{ person.title }}</h1>
        </b-col>
        <b-col xl="4">
          Put an image here ...
        </b-col>
      </b-row>
      <b-row>
        <b-col
          v-html="person.body.value"
          class="book__body"
          xl="8"/>
      </b-row> -->
    </b-container>
  </div>
</template>

<script>
import * as qs from "qs";

export default {
  async asyncData({ app, params }) {
    const personParams = qs.stringify({
      path: `${params.vertical}/contributor/${params.title}`,
      fields: {
        "node--person": ["title", "body", "field_image", "path"]
      },
      include: "field_image",
      headers: {
        "Content-Type": "application/json",
        "X-CONSUMER-ID": process.env.CONSUMER_ID
      },
      waitFor: ["router"]
    });
    const attributes = await app.$axios
      .get(`/router/translate-path?${personParams}`)
      .then(res => {
        return app.$axios
          .get(`/api/node/person/${res.data.entity.uuid}`, personParams)
          .then(res => {
            console.log(
              "\n\n---------------------- geoff ------------------------\n",
              res.data.data.relationships.field_image.data[0].id
            );
            return res.data.data;
          })
          .catch(err => {
            console.log(err);
          });
      });
    console.log(
      "\n\n----------------attributes -------------------\n\n\n\n",
      attributes
    );

    const image = await app.$axios.get(
      `/api/file/file/${attributes.relationships.field_image.data[0].id}`
    );

    return {
      // person: attributes,
      image
    };
  }
};
</script>

<style scoped lang="scss">
.book__body {
  font-weight: 400;
  font-size: 1.2em;
}
</style>

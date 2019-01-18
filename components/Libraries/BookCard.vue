<template>
  <b-card
    class="card--book"
    tag="article"
  >
    <b-img
      slot="header"
      fluid
      :src="baseurl + field_image"
    />
    <h3 class="card-title">
      <b-link
        :to="view_node_1"
        itemprop="title"
      >
        {{ title }}
      </b-link>
    </h3>
    <div class="card--book__author-year">
      {{ field_author }} <span v-if="field_date_published"> - {{ field_date_published }}</span>
    </div>
    <p v-html="body"/>
  </b-card>
</template>
<script>
export default {
  data() {
    return {
      baseurl: process.env.baseURL
    };
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    body: {
      type: String,
      default: ""
    },
    field_author: {
      type: String,
      default: ""
    },
    field_date_published: {
      type: String,
      default: ""
    },
    view_node_1: {
      type: String,
      default: "/"
    },
    field_image: {
      type: String,
      default: ""
    }
  }
};
</script>

<style lang="scss">
.card.card--book {
  border: none;
  background-color: transparent;
  flex-direction: row;

  @include media-breakpoint-up(md) {
    flex-direction: column;
  }

  .card-header {
    padding: 0;
    border: 5px solid #f0f2f5;
    border-bottom: none;
    background-color: transparent;
  }

  .card-title {
    a {
      color: var(--red-dark);
    }
  }

  .card-body {
    background-color: transparent;
  }

  .card--book__author-year {
    margin-bottom: 0.8rem;
  }

  p {
    font-weight: 400;
  }
}
</style>

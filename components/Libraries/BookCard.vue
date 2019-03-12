<template>
  <b-card
    class="card--book"
    tag="article"
  >
    <b-link
      :href="view_node_1"
      slot="header"
    >
      <b-img-lazy
        v-if="field_image"
        fluid
        :src="field_image.src"
        :alt="field_image.alt"
      />
    </b-link>
    <h3 class="card-title">
      <b-link
        v-html="title"
        :href="view_node_1"
        itemprop="title"
      />
    </h3>
    <div class="card--book__author-year">
      {{ field_author }} <span v-if="field_date_published"> - {{ field_date_published }}</span>
    </div>
    <app-teaser-text :text="body"/>
  </b-card>
</template>
<script>
import AppTeaserText from "~/components/AppTeaserText";
export default {
  name: "BookCard",
  components: { AppTeaserText },
  data() {
    return {
      baseUrl: process.env.baseURL
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
      type: Object,
      default: null
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
    background-color: transparent;
    @media (min-width: 768px) {
      border: 5px solid #f0f2f5;
      border-bottom: none;
    }
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

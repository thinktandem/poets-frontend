
<template>
  <b-card
    class="card--book"
    tag="article"
  >
    <b-img
      :src="img.src"
      slot="header"
      fluid
    />
    <h3 class="card-title">
      <b-link
        :to="link"
        itemprop="title"
      >
        {{ title }}
      </b-link>
    </h3>
    <div class="card--book__author-year">
      {{ author }} <span v-if="year"> - {{ year }}</span>
    </div>
    <p v-html="text" />
  </b-card>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    text: {
      type: String,
      default: ""
    },
    author: {
      type: String,
      default: ""
    },
    year: {
      type: String,
      default: ""
    },
    link: {
      type: String,
      default: "/"
    },
    img: {
      type: Object,
      default: () => {}
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

<template>
  <b-card-group deck>
    <b-card
      v-for="(poem, index) in this.poems"
      class="card--poem"
      :key="index"
      :title="poem.title"
    >
      <div
        class="card-body"
        v-html="poem.text"/>
      <div class="card-footer">
        <p>{{ poem.poet.name }}</p>
        <p>{{ poem.year }}</p>
      </div>
    </b-card>
  </b-card-group>
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
    }
  }
};
</script>

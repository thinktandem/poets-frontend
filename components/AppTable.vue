<template>
  <b-table 
    :items="items"
    :sort-by="sortBy"
    :fields="fields"
    stacked="sm"
    hover/>
</template>

<script>
export default {
  name: "AppTable",
  props: {
    items: {
      type: Array,
      required: true
    },
    sortBy: {
      type: String,
      default: "date"
    },
    fields: {
      type: Array,
      required: true
    }
  }
};
</script>

<style lang="scss">
thead {
  th {
    background-color: $gray-200;
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
  }
}
.previous-poems__date {
  font-weight: 400;
  font-size: 0.9rem;
}
.previous-poems__title {
  font-size: 1.15rem;
}
.previous-poems__poet {
  font-weight: 400;
}
</style>

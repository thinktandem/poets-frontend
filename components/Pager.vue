<template>
  <b-pagination
    :total-rows="totalRows"
    :per-page="perPage"
    v-model="currentPage"
    first-text
    last-text
    prev-text="<i></i> Prev"
    next-text="Next <i></i>"
  />
</template>

<script>
import mediaSkipBackwards from "~/static/icons/media-skip-backwards.svg";
import mediaSkipForwards from "~/static/icons/media-skip-forwards.svg";

export default {
  components: {
    mediaSkipBackwards,
    mediaSkipForwards
  },

  props: {
    totalRows: {
      type: Number,
      default: 0
    },
    currentPage: {
      type: Number,
      default: 1
    },
    perPage: {
      type: Number,
      default: 5
    }
  }
};
</script>

<style lang="scss">
.pagination {
  display: flex;

  li {
    &:nth-child(2),
    &:nth-last-child(2) {
      flex-grow: 1;
    }

    &:nth-last-child(2) {
      text-align: right;
    }

    &.active {
      .page-link {
        background-color: var(--blue-dark);
      }
    }

    .page-link {
      border: none;

      background-color: transparent;
    }
  }
}
</style>

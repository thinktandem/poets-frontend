<template>
  <b-card
    class="poet"
    itemprop="author"
    itemscope
    itemtype="http://schema.org/Person"
  >
    <b-img
      v-if="field_image"
      :src="baseurl + field_image"
      fluid-grow
    />
    <div
      v-else
      class="empty-div"
    />
    <div class="poet__name-bio">
      <div
        class="poet__name"
        itemprop="title"
      >
        <h3>
          {{ title }}
        </h3>
        <div
          class="job-title"
          v-html="job"/>
      </div>
      <div class="poet__bio">
        <div v-html="bio"/>
        <div
          class="orange-link-holder">
          <a
            :href="link"
            class="poet__link"
          >
            View Contributions
          </a>
        </div>
      </div>
    </div>
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
    bio: {
      type: String,
      default: ""
    },
    field_image: {
      type: String,
      default: ""
    },
    job: {
      type: String,
      default: ""
    },
    link: {
      type: String,
      default: "#"
    }
  }
};
</script>

<style scoped lang="scss">
.poet {
  margin: 0;
  position: relative;
  overflow: hidden;
  border: none;

  .card-body {
    padding: 0;
  }
  .empty-div {
    min-height: 384px;
    min-width: 388px;
    background-color: var(--gray-900);
  }
  .poet__name {
  }
  &__name-bio {
    position: absolute;
    top: calc(100% - 4.88rem);
    bottom: 0;
    left: 0;
    right: 0;
    transition: top 0.25s ease-in-out;
    display: flex;
    flex-direction: column;

    &:hover,
    &:focus,
    &:active {
      top: 0;
    }
  }
  .orange-link-holder {
    background-color: var(--orange);
    min-width: 282px;
    padding: 12px;
    position: relative;
    left: -16px;
    bottom: -20px;
    a {
      color: var(--gray-darkest);
    }
  }
  &__name {
    margin: 0;
    padding: 1rem;
    background-color: var(--gray-darkest);
    border-bottom: 3px solid var(--orange);
    font-size: 1.25rem;
    color: var(--white);
    opacity: 0.9;
  }

  &__bio {
    flex-grow: 1;
    padding: 1rem;
    color: var(--white);
    background-color: var(--gray-800);
    font-weight: 400;
    overflow: scroll;
  }

  &__link {
    color: var(--white);
    font-weight: 700;

    &::after {
      content: " >";
    }

    &:hover,
    &:focus,
    &:active {
      color: var(--white);
      text-decoration: underline;
    }
  }
}
</style>

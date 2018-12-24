<template>
  <b-card
    :title="title"
    class="card--callout"
    bg-variant="warning">
    <b-img
      class="card--callout__image"
      width="110"
      height="110"
      blank
      blank-color="#00B4F0"/>
    <p class="card-text"><slot/></p>
    <div slot="footer">
      <b-btn
        :to="action.to"
        class="border-primary bg-white text-primary">{{ action.text }}</b-btn>
    </div>
  </b-card>
</template>

<script>
export default {
  name: "CalloutCard",
  props: {
    title: {
      type: String,
      default: "Teach This Poem"
    },
    body: {
      type: String,
      default: "Body"
    },
    icon: {
      type: String,
      default: "lightbulb"
    },
    action: {
      type: Object,
      default() {
        return {
          to: "/",
          text: "Learn More & Sign Up"
        };
      }
    }
  }
};
</script>

<style scoped lang="scss">
.card--callout {
  padding-top: $spacer * 3;
  border: none;
  .card-title {
    font-size: 1.15rem;
    line-height: 1.75rem;
    font-family: $font-family-sans-serif;
    font-weight: bold;
    font-style: normal;
  }
  .card-text {
    padding: 0;
    font-size: 0.9rem;
    font-weight: 400;
  }
  .card-header,
  .card-footer {
    padding-top: $spacer / 2;
    background-color: $orange;
  }
  &__image {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: -55px;
  }
  @include media-breakpoint-up(md) {
    padding-left: $spacer * 5.75;
    padding-top: initial;
    .card-body {
      padding: ($spacer * 1.25) ($spacer * 3) 0 0;
    }
    .card-footer {
      padding-left: 0;
    }
    &__image {
      position: absolute;
      left: -13px;
      top: -13px;
      transform: initial;
    }
  }
}
</style>

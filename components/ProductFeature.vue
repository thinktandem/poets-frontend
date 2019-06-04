<template>
  <section class="bg-dark text-white">
    <b-container class="product-feature">
      <div class="d-flex flex-column flex-lg-row">
        <div
          class="product-feature__info pb-4 pb-lg-5">
          <h2
            class="font-serif font-italic pb-3"
            v-show="title">
            <b-link
              class="apm__cta-link"
              to="/american-poets-magazine">
              {{ title }}
            </b-link>
          </h2>
          <div class="pl-lg-4 pr-md-3">
            <div
              v-show="intro"
              class="pb-4 product-feature__intro"
              v-html="replaceFileUrl(intro)"/>
            <h3
              class="text-primary-lightest pb-2"
              v-show="subTitle">{{ subTitle }}</h3>
            <ul
              class="list-unstyled product-feature__list"
              v-show="contents">
              <li
                v-for="(item, index) in contents"
                :key="index" >{{ item }}</li>
            </ul>
            <p class="pl-4 more">... and much more</p>
            <b-btn
              :to="link.to"
              variant="secondary">{{ link.text }}</b-btn> <span class="pl-2">to receive your copy of American Poets twice a year.</span>
          </div>
        </div>
        <div
          class="product-feature__image"
          v-show="img">
          <b-link
            class="apm__cta-link"
            to="/american-poets-magazine">
            <b-img-lazy
              fluid
              :alt="img.alt"
              :src="img.src"/>
          </b-link>
        </div>
      </div>
    </b-container>
  </section>
</template>

<script>
export default {
  name: "ProductFeature",
  props: {
    title: {
      type: String,
      default: "American Poets Magazine"
    },
    subTitle: {
      type: String,
      default: ""
    },
    intro: {
      type: String,
      default: ""
    },
    contents: {
      type: Array,
      default() {
        return [];
      }
    },
    img: {
      type: Object,
      default() {
        return {
          src: "",
          alt: ""
        };
      }
    },
    link: {
      type: Object,
      default() {
        return {
          to: "/membership",
          text: "Become a Member"
        };
      }
    }
  }
};
</script>

<style scoped lang="scss">
.product-feature {
  padding-top: $spacer * 4.5;
  &__intro {
    font-size: 1.25rem;
    font-weight: 400;
    line-height: 1.75rem;
  }
}
.product-feature__info {
  order: 2;
}
h2 {
  font-size: 2.65rem;
  line-height: 2.75rem;
}
.product-feature__list {
  padding-left: 0.25rem;
}
.product-feature__list li:before {
  content: "";
  margin-right: 0.75rem;
  height: 10px;
  width: 10px;
  border-radius: 50%;
  display: inline-block;
  background-color: $orange;
}
.more {
  font-weight: 400;
}
.product-feature__image {
  order: 1;
  perspective: 1000px;
  transform: translateY(-3.75rem);
  width: 50%;
  margin: auto;
  img {
    transform: rotateY(-25deg) rotateX(20deg);
    box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.2);
  }
}
@include media-breakpoint-up(lg) {
  .product-feature__info {
    padding-right: 5rem;
    order: 1;
    width: 60%;
  }
  .product-feature__list {
    padding-right: 4rem;
  }
  .product-feature__image {
    order: 2;
    width: 40%;
  }
}
.apm__cta-link {
  color: var(--white);
}
</style>

<template>
  <section class="bg-dark text-white">
    <b-container class="product-feature">
      <div class="d-flex flex-column flex-lg-row">
        <div
          class="product-feature__info pb-4 pb-lg-5">
          <h2 
            class="font-serif pb-3" 
            v-if="$store.state.productFeature.title">{{ $store.state.productFeature.title }}</h2>
          <div class="pl-lg-4 pr-md-3">
            <p 
              class="pb-4 product-feature__intro"
              v-if="$store.state.productFeature.intro"
              v-html="$store.state.productFeature.intro"/>
            <h3 
              class="text-primary-lightest pb-2" 
              v-if="$store.state.productFeature.subTitle">{{ $store.state.productFeature.subTitle }}</h3>
            <ul 
              class="list-unstyled product-feature__list"
              v-if="$store.state.productFeature.contents.length >= 1">
              <li 
                v-for="(item, index) in $store.state.productFeature.contents"
                :key="index" >{{ item }}</li>
            </ul>
            <p class="pl-4">... and much more</p>
            <b-btn
              to="/something"
              variant="secondary">Become a Member</b-btn> <span class="pl-2">to receive your copy of American Poets twice a year.</span>
          </div>
        </div>
        <div 
          class="product-feature__image" 
          v-if="$store.state.productFeature.img">
          <b-img-lazy
            fluid
            :alt="$store.state.productFeature.img.alt"
            :src="$store.state.productFeature.img.src"/>
        </div>
      </div>
    </b-container>
  </section>
</template>

<script>
export default {
  name: "ProductFeature"
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
</style>

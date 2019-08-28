<template>
  <div>
    <b-modal
      v-model="show"
      id="isa"
      class="isa-cta"
      size="xl"
      centered
      :title="isaTitle"
      :header-bg-variant="headerBgVariant"
      :header-text-variant="headerTextVariant"
      :body-bg-variant="bodyBgVariant"
      :body-text-variant="bodyTextVariant"
      :isa-id="isaId"
      hide-footer>
      <div v-html="isaBody"/>
    </b-modal>
  </div>
</template>

<script>
import inlineImages from "~/plugins/inlineImagesUrl";

import SignupBlock from "~/components/SignupBlock";
import PromoSpace from "~/components/PromoSpace";

export default {
  components: { SignupBlock, PromoSpace },
  props: {
    isaId: {
      type: String,
      default: "isa"
    }
  },
  data() {
    return {
      variants: [
        "primary",
        "secondary",
        "success",
        "warning",
        "danger",
        "info",
        "light",
        "dark"
      ],
      headerBgVariant: "dark",
      headerTextVariant: "light",
      bodyBgVariant: "light",
      bodyTextVariant: "dark",
      footerBgVariant: "warning",
      footerTextVariant: "dark",
      isaTitle: "",
      isaBody: "",
      show: this.$store.state.isa.isaShow
    };
  },
  created() {
    this.getIsa();
  },
  methods: {
    getIsa() {
      this.isaTitle = this.$store.state.isa
        ? this.$store.state.isa.isaTitle
        : null;
      this.isaBody = this.$store.state.isa
        ? inlineImages.staticUrl(this.$store.state.isa.isaBody)
        : null;
      this.show = this.$store.state.isa.isaShow;
    }
  }
};
</script>
<style scoped>
.isa-cta /deep/ img {
  max-width: 100%;
}
</style>

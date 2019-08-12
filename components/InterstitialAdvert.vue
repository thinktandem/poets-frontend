<template>
  <div>
    <b-button
      @click="show=true"
      variant="primary">
      Show Modal
    </b-button>
    <b-modal
      v-model="show"
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
      default: "--"
    }
  },
  data() {
    return {
      show: false,
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
      isaTitle: "isa title",
      isaBody: "This be memow body text ..."
    };
  },
  mounted() {
    Promise.all([this.getIsa()]);
  },
  methods: {
    getIsa() {
      const isaQuery = {
        query: {
          filter: {
            id: this.isaId
          }
        }
      };
      this.$api
        .getIsa(isaQuery)
        .then(res => {
          console.log("geoff res", res);
          this.isaTitle = _.get(res, "data.data[0].attributes.title");
          this.isaBody = inlineImages.staticUrl(
            _.get(res, "data.data[0].attributes.body.value")
          );
        })
        .catch(err => console.log("geoff err", err));
    }
  }
};
</script>

<template>
  <b-modal
    v-model="show"
    id="isa"
    class="isa-cta"
    size="lg"
    centered
    @hidden="dismiss"
    :title="isaHeader"
    :header-bg-variant="headerBgVariant"
    :header-text-variant="headerTextVariant"
    :body-bg-variant="bodyBgVariant"
    :body-text-variant="bodyTextVariant"
    :hide-header="hideHeader"
    hide-footer>
    <div v-html="isaBody"/>
  </b-modal>
</template>

<script>
import _ from "lodash";
import inlineImages from "~/plugins/inlineImagesUrl";

export default {
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
      isaHeader: null,
      isaBody: "",
      show: false
    };
  },
  computed: {
    hideHeader() {
      return _.isEmpty(this.isaHeader);
    }
  },
  mounted() {
    this.getIsa();
  },
  watch: {
    $route: function(id) {
      this.getIsa();
    }
  },
  methods: {
    getIsa() {
      const isaCookie = this.$cookies.get("isa-" + this.$route.path) || false;
      if (this.$store.state.isa && !isaCookie) {
        this._setIsaData();
        this.$cookies.set(
          "isa-" + this.$route.path,
          {
            value: 0,
            route: this.$route.path
          },
          {
            maxAge: 60 * 60 * 24
          }
        );
      } else if (isaCookie.value === 0) {
        this._setIsaData();
      }
    },
    _setIsaData() {
      this.isaHeader = this.$store.state.isa
        ? this.$store.state.isa.isaHeader
        : null;
      this.isaBody = this.$store.state.isa
        ? inlineImages.staticUrl(this.$store.state.isa.isaBody)
        : null;
      const showIt = _.get(this.$store, "state.isa.isaShow", false);
      this.show = showIt;
    },
    dismiss() {
      this.show = false;
    }
  }
};
</script>
<style scoped>
.isa-cta /deep/ img {
  max-width: 100%;
}
.isa-cta /deep/ .modal-body {
  padding: 0px;
  p {
    margin-bottom: 0;
  }
}
</style>

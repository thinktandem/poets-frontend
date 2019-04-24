<template>
  <div>
    <product-feature
      v-if="latest"
      :title="latest.title"
      :sub-title="latest.subTitle"
      :intro="latest.intro"
      :contents="latest.contents"
      :img="latest.img"
      :link="latest.link"/>
    <basic-page
      :page-data="$store.state.pageData"
      :highlighted="$store.state.highlightedData"
      :more="$store.state.relatedContent"
      :extended-content="$store.state.extendedContent"
      :sidebar-data="$store.state.sidebarData"/>
  </div>
</template>
<script>
import _ from "lodash";
import qs from "qs";
import BasicPage from "~/components/BasicPage";
import ProductFeature from "~/components/ProductFeature";
import MetaTags from "~/plugins/metatags";
export default {
  components: {
    BasicPage,
    ProductFeature
  },
  head() {
    return MetaTags.renderTags(this.$store.state.metatags);
  },
  async asyncData({ app }) {
    const magazineQuery = qs.stringify({
      filter: {
        status: 1
      },
      sort: "-changed",
      page: {
        limit: 1
      },
      include: "field_image,field_content_sections"
    });
    return app.$axios
      .$get(`/api/node/magazine?${magazineQuery}`)
      .then(magazine => {
        const topProduct = _.first(magazine.data);
        return {
          latest: {
            response: magazine,
            entity: topProduct,
            title: _.get(topProduct, "attributes.title", null),
            intro: _.get(
              topProduct,
              "attributes.magazine_intro.processed",
              null
            ),
            subTitle: _.get(topProduct, "attributes.subtitle", null),
            contents: _.get(topProduct, "attributes.contents", null),
            img: app.$buildImg(
              magazine,
              topProduct,
              "field_image",
              "magazine_cover"
            ),
            link: {
              to: `/academy-american-poets/become-member`,
              text: "Become a member"
            }
          }
        };
      });
  },
  async fetch({ app, store, route }) {
    return app.$buildBasicPage(app, store, route.path);
  }
};
</script>

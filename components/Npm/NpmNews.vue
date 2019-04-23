<template>
  <b-container>
    <b-row
      v-for="item in news"
      :key="`item-${item.title}`"
    >
      <b-col lg="12">
        <b-container>
          <b-row class="npm__event-row">
            <b-col
              lg="5">
              <div
                class="npm__news-row-image">
                <b-img-lazy
                  fluid
                  :src="baseURL + item.field_image"/>
              </div>
            </b-col>
            <b-col lg="7">
              <div class="npm__news-row-date">
                {{ item.created }}
              </div>
              <div class="npm__news-row-title">
                <b-link
                  :to="item.view_node">
                  {{ item.title }}
                </b-link>
              </div>
              <div
                v-html="replaceFileUrl(item.body)"
                class="npm__news-row-body"/>
            </b-col>
          </b-row>
        </b-container>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      baseURL: process.env.baseURL
    };
  },
  props: {
    news: {
      type: Array,
      default: () => []
    }
  }
};
</script>
<style scoped lang="scss">
h3 {
  font-family: "Poets Electric";
  font-weight: 566;
  font-style: italic;
}
.npm__event-row {
  margin-bottom: 16px;
}
.npm__news-row-date {
  color: var(--red-dark);
}
.npm__news-row-title {
  color: #007ab3;
  font-family: "Founders Grotesk";
  font-size: 24px;
  font-weight: 500;
  line-height: 28px;
}
.npm__news-row-body {
  color: #212b36;
  font-size: 16pxa;
  font-weight: 400;
}
.npm__news-row-more-link {
  font-size: 20px;
}
</style>

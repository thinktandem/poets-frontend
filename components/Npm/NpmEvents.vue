<template>
  <b-container>
    <b-row>
      <h3>News & Updates</h3>
    </b-row>
    <b-row
      v-for="item in news"
      :key="`item-${item.title}`"
    >
      <b-col lg="12">
        <b-container>
          <b-row>
            <b-col
              lg="1">
              <div
                v-if="field_content_sections"
                class="npm__news-row-image">
                {{ field_content_sections }}
              </div>
              <div
                v-else
                class="npm__news-row-image">
                <TwitterIcon/>
              </div>
            </b-col>
            <b-col lg="11">
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
                v-html="item.body"
                class="npm__news-row-body"/>
            </b-col>
          </b-row>
        </b-container>
      </b-col>
    </b-row>
    <b-row>
      <b-col
        lg="12"
        class="npm__news-row-more-link">
        <b-link
          to="/national-poetry-month/news">
          More News & Updates >
        </b-link>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import TwitterIcon from "~/static/social/twitter-just-bird.svg";

export default {
  components: {
    TwitterIcon
  },
  props: {
    news: {
      type: Object,
      default: () => {}
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

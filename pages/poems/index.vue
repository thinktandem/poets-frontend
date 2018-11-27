<template>
  <div>
    <b-container class="poems-list py-5">
      <b-row class="poems-list__row">
        <b-col md="4">
          <div class="poems-list__list-header">
            Name
          </div>
        </b-col>
        <b-col md="4">
          <div class="poems-list__list-header">
            Years  
          </div>
        </b-col>
        <b-col md="4">
          <div class="poems-list__list-header">
            Schools and Movements
          </div>
        </b-col>
      </b-row>
      <b-row
        v-for="poem in poems"
        class="poems-list__row poems-list__poems"
        :key="poem.id">
        <b-col md="4">
          <a :href="`/poems/${getPoemTitle(poem.view_node)}`">
            {{ poem.title }}
          </a>
        </b-col>
        <b-col md="4">
          {{ poem.nothing }}
        </b-col>
        <b-col md="4">
          {{ poem.field_school_movement }}
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import AppPoemADaySignUpForm from "../../components/AppPoemADayPoems/AppPoemADaySignUpForm";
import AppPoems from "../../components/AppPoemADayPoems/AppPoems";
export default {
  components: { AppPoemADaySignUpForm, AppPoems },
  async asyncData({ app, params }) {
    const options = {
      method: "GET",
      url: "http://apipoetsd8.lndo.site" + "/api/poems"
    };

    return app
      .$axios(options)
      .then(res => {
        return {
          poems: res.data
        };
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    getPoemTitle(viewNode) {
      const title = viewNode.split("/");

      return title[3];
    }
  }
};
</script>

<style scoped lang="scss">
@import "~bootstrap/scss/mixins";
@import "~bootstrap/scss/variables";
@import "~bootstrap/scss/functions";

.poems-list__row {
  border-bottom: 1px solid #ccc;
  font-size: 18px;
  min-height: 47px;
}
.poems-list__list-header {
  font-weight: bold;
}
.poems-list__poems {
  font-weight: 111;
}
</style>

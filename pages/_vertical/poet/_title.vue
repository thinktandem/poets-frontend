<template>
  <div>
    <b-container class="py-5">
      <h1>{{ poet.attributes.title }}</h1>
    </b-container>
  </div>
</template>

<script>
import AppPoemADaySignUpForm from "~/components/AppPoemADayPoems/AppPoemADaySignUpForm";
import AppPoems from "~/components/AppPoemADayPoems/AppPoems";
export default {
  components: { AppPoemADaySignUpForm, AppPoems },
  async asyncData({ app, params }) {
    return app.$axios
      .get(`/router/translate-path`, {
        params: {
          path: `${params.vertical}/poet/${params.title}`
        }
      })
      .then(res => {
        return app.$axios
          .get(`/api/node/person/${res.data.entity.uuid}`)
          .then(res => {
            return {
              poet: res.data.data
            };
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>

<style scoped lang="scss">
</style>

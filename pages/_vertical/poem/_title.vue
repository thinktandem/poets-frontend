<template>
  <div>
    <b-container class="py-5">
      <b-row>
        <b-col md=8>
          <b-card
            :title="poem.attributes.title"
            class="card--main"
          >
            <div
              class="card-subtitle"
              v-if="`${poet} !== null`"
            >
              {{ poet.attributes.title }} -
              {{ poet.field_dob }} - {{ poet.field_dod }}
            </div>
            <!-- <div
              class="card-body"
              v-html="poem.attributes.title" /> -->
            <div
              class="card--poem__attribution text-muted"
              v-html="poem.attributes.body.value"
            />
          </b-card>
        </b-col>
        <b-col md=4>
          <div class="poet--aside">
            <b-img class="poet--aside__image" />
            <p class="poet--aside__bio text-dark-muted">{{ poem.attributes.url }}</p>
            <b-link :to="poem.link">More {{ poem.attributes.title }}</b-link>
          </div>
          <app-poem-a-day-sign-up-form />
        </b-col>
      </b-row>
    </b-container>
    <poem-card-deck
      :title="`More by ${poet.attributes.title}`"
      :more-count="poem.attributes.length"
      :poems="poet.attributes.title"
    />
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
          path: `${params.vertical}/poem/${params.title}`
        }
      })
      .then(res => {
        return app.$axios
          .get(`/api/node/poems/` + res.data.entity.uuid, {
            params: {
              include: "field_author"
            }
          })
          .then(res => {
            console.log("authTst", res.data);
            let myPoet = null;
            if ("included" in res.data) {
              myPoet = res.data.included[0];
            }
            return {
              poem: res.data.data,
              poet: myPoet
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
.card--main {
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.05), 0 4px 0 0 var(--green);
  .card-title {
    font-size: 2.5rem;
  }

  .card-subtitle {
    font-family: $font-family-sans-serif;
    font-size: 1.25rem;
    line-height: 1.75rem;
    color: var(--black);
  }

  .card-body {
    font-size: 1.25rem;
    line-height: 1.87rem;
    font-family: $font-family-serif-italic;
  }
  .card--poem__attribution {
    font-family: $font-family-serif-italic;
    font-size: 0.8rem;
    line-height: 1.25rem;
  }
}

.poet--aside__bio {
  font-size: 0.9rem;
  line-height: 1.07rem;
}
</style>

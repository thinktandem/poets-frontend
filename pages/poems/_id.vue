<template>
  <div>
    <b-container class="py-5">
      <b-row>
        <b-col md=8>
          <b-card
            :title="poem.title"
            class="card--main">
            <div class="card-subtitle">{{ poem.subTitle }}</div>
            <div
              class="card-body"
              v-html="poem.text" />
            <div
              class="card--poem__attribution text-muted"
              v-html="poem.attribution"/>
          </b-card>
        </b-col>
        <b-col md=4>
          <div class="poet--aside">
            <b-img class="poet--aside__image" />
            <p class="poet--aside__bio text-dark-muted">{{ poet.bio }}</p>
            <b-link :to="poet.link">More {{ poet.name }}</b-link>
          </div>
          <app-poem-a-day-sign-up-form/>
        </b-col>
      </b-row>
    </b-container>
    <poem-card-deck
      :title="`More by ${poet.name}`"
      :more-count="this.poet.poems.length"
      :poems="this.poet.poems"
    />
  </div>
</template>

<script>
// import axios from "axios";
import AppPoemADaySignUpForm from "../../components/AppPoemADayPoems/AppPoemADaySignUpForm";
import AppPoems from "../../components/AppPoemADayPoems/AppPoems";
export default {
  components: { AppPoemADaySignUpForm, AppPoems },
  async asyncData({ params }) {
    // const { data } = await axios.get(`${apiUrl}/node/poem/${params.id}`, {
    //   params: {
    //     include: "poem_image"
    //   }
    // });

    // return { poem: data };
    return {
      poem: {
        title: "Some title",
        subTitle: "Subtitle",
        text: `Multiline <br/> Poem <br/> Body`,
        attribution: `Copyright © 2015 by D. Nurkse.<br/>
Originally published in Poem-a-Day on May 7, 2015, by the Academy of American Poets.`
      },
      poet: {
        image: "/static/images/speaker.png",
        name: "some-name",
        slug: "some-name",
        poems: ["thing1", "thing2"],
        bio:
          "D. Nurkse is the author of ten poetry collections, including A Night in Brooklyn (Alfred A. Knopf, 2012).",
        link: "/poets/${this.poet.slug}"
      }
    };
  },
  fetch({ store, params }) {
    // Set the current hero
    store.commit("updateHero", {
      heading: "Find Poems",
      variant: "default",
      lead:
        "Find the perfect poems, save them, and share them to your heart’s content."
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
    font-family: $font-family-serif;
  }
  .card--poem__attribution {
    font-family: $font-family-serif;
    font-size: 0.8rem;
    line-height: 1.25rem;
  }
}

.poet--aside__bio {
  font-size: 0.9rem;
  line-height: 1.07rem;
}
</style>

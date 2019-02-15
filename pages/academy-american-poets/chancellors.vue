<template>
  <div>
    <AapNav/>
    <b-container>
      <CardDeck
        cardtype="Chancellors"
        cols="4"
        :cards="chancellors"
      />
    </b-container>
  </div>
</template>

<script>
import AapNav from "~/components/Aap/AapNav";
import CardDeck from "~/components/CardDeck";

export default {
  components: {
    AapNav,
    CardDeck
  },
  data() {
    return {};
  },
  async asyncData({ app, store, params }) {
    let chancellors = await app.$axios
      .get("/api/aap_chancellors", {})
      .then(res => {
        return {
          rows: res.data.rows
        };
      })
      .catch(err => {
        console.log(err);
      });

    return {
      chancellors: chancellors.rows
    };
  },
  methods: {},
  watchQuery: true
};
</script>

<style scoped lang="scss">
</style>

<template>
  <div>
    <AapNav/>
    <b-container>
      <CardDeck
        cardtype="Staff"
        cols="3"
        :cards="staff"
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
    let staff = await app.$axios
      .get("/api/aap_staff", {})
      .then(res => {
        return {
          rows: res.data.rows
        };
      })
      .catch(err => {
        console.log(err);
      });

    return {
      staff: staff.rows
    };
  },
  methods: {},
  watchQuery: true
};
</script>

<style scoped lang="scss">
</style>

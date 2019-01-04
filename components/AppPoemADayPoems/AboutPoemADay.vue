<template>
  <b-container
    md="4"
    class="poem-a-day__about"
  >
    <div class="poem-a-day__about-title">About Poem-a-Day</div>
    <p class="poem-a-day__about-content">
      Poem-a-day is the original and only daily digital poetry series featuring
      over 200 new, previously unpublished poems by today’s talented poets each
      year. On weekdays, poems are accompanied by exclusive commentary by the
      poets. The series highlights classic poems on weekends. Launched in 2006,
      Poem-a-Day is now distributed via email, web, and social media to
      350,000+ readers free of charge and is available for syndication. For more
      information about how to syndicate Poem-a-Day, contact
      poem-a-day@poets.org.
    </p>
  </b-container>
</template>
<script>
export default {
  components: {}
};
</script>
<style scoped lang="scss">
.poem-a-day__about {
  margin-left: 28px;
  width: 30%;
  .poem-a-day__about-title {
    margin: 8px;
    height: 30px;
    width: 298px;
    color: #212b36;
    font-family: "Poets Electra";
    font-size: 30px;
    font-style: italic;
    line-height: 30px;
  }
  .poem-a-day__about-content {
    font-weight: 400;
  }
  margin-bottom: 89px;
}
</style>

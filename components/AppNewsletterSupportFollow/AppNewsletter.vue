<template>
  <div
    class="newsletter">
    <h3 class="signup-title">Newsletter Sign Up</h3>
    <div class="newsletter__form">
      <form>
        <b-form-checkbox
          v-model="aapn"
          type="checkbox"
          id="aapn"
          class="newsletter-checkbox">
          Academy of American Poets Newsletter
        </b-form-checkbox>
        <br>
        <b-form-checkbox
          v-model="aapen"
          type="checkbox"
          id="aapen"
          class="newsletter-checkbox">
          Academy of American Poets Educator Newsletter
        </b-form-checkbox>
        <br>
        <b-form-checkbox
          v-model="aapttp"
          type="checkbox"
          id="aapttp"
          class="newsletter-checkbox">
          Teach This Poem
        </b-form-checkbox>
        <br>
        <b-form-checkbox
          v-model="aappad"
          type="checkbox"
          id="aappad"
          class="newsletter-checkbox">
          Poem-a-Day
        </b-form-checkbox>
        <b-form-input
          v-model="email"
          size="9"
          type="email"
          placeholder="john@example.com"/>
        <button
          type="button"
          class="btn btn-primary">
          submit
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data {
    return {
      email: ""
    };
  },
  methods: {
    newsletterSignup() {
      console.log(this.aapttp);
      // const body = {
      //   email: this.email,
      //   forms: {
      //     "aappad"
      //   }
      // };
      // this.$axios
      //   .post("/api/cm/poem-a-day", body)
      //   .then(req => {
      //     console.log("Post req sent");
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
      // this.$router.push("/newsletter-thanks");
    }
  }
};
</script>
<style scoped lang="scss">
.newsletter-checkbox {
  font-size: 14px;
  font-weight: 100;
}
</style>

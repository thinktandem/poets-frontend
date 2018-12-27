<template>
  <div class="newsletter">
    <h3 class="signup-title">Newsletter Sign Up</h3>
    <div class="newsletter__form newsletter__content">
      <form @submit.stop.prevent="newsletterSignup">
        <b-form-checkbox
          v-model="aapn"
          type="checkbox"
          id="aapn"
          class="newsletter-checkbox"
        >
          Academy of American Poets Newsletter
        </b-form-checkbox>
        <br>
        <b-form-checkbox
          v-model="aapen"
          type="checkbox"
          id="aapen"
          class="newsletter-checkbox"
        >
          Academy of American Poets Educator Newsletter
        </b-form-checkbox>
        <br>
        <b-form-checkbox
          v-model="aapttp"
          type="checkbox"
          id="aapttp"
          class="newsletter-checkbox"
        >
          Teach This Poem
        </b-form-checkbox>
        <br>
        <b-form-checkbox
          v-model="aappad"
          type="checkbox"
          id="aappad"
          class="newsletter-checkbox"
        >
          Poem-a-Day
        </b-form-checkbox>
        <div class="newsletter__email">
          <b-form-input
            v-model="newsletterEmail"
            id="newsletterEmail"
            size="9"
            type="email"
            placeholder="john@example.com"
          />
          <button
            type="button"
            class="btn btn-primary"
            @click.stop.prevent="newsletterSignup"
          >
            submit
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      aapn: false,
      aapen: false,
      aapttp: false,
      aappad: false,
      newsletterEmail: ""
    };
  },
  methods: {
    newsletterSignup() {
      const body = {
        email: this.newsletterEmail,
        forms: {
          AAPN: this.aapn || false,
          AAPEN: this.aapen || false,
          AAPTTP: this.aapttp || false,
          AAPPAD: this.aappad || false
        }
      };
      this.$axios
        .post("/api/cm/poem-a-day", body)
        .then(req => {
          console.log("Post req sent");
        })
        .catch(err => {
          console.log(err);
        });
      this.$toast
        .show("Thanks! You are subscribed.", {
          theme: "toasted-primary",
          position: "top-left"
        })
        .goAway(1500);
    }
  }
};
</script>
<style lang="scss" scoped>
.newsletter-checkbox {
  label {
    &::before {
      border-radius: 2px;
      border-color: $gray-600;
    }
  }
}

input {
  &[type="checkbox"] {
    &:checked {
      & + label {
        &::before {
          border-color: $body-color;
        }
      }
    }
  }
}

.newsletter__email {
  margin-top: 1rem;
  height: 2.25rem;
  display: flex;

  button {
    padding-top: 0.3rem;
    border: none;
    background-color: var(--primary-dark);
  }
}
</style>

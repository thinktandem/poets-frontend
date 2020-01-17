<template>
  <div class="newsletter">
    <h3 class="signup-title">Newsletter Sign Up</h3>
    <div class="newsletter__form newsletter__content">
      <app-form @submit="newsletterSignup">
        <b-form-checkbox
          v-model="list['academy-newsletter']"
          type="checkbox"
          id="aapn"
          class="newsletter-checkbox"
        >
          Academy of American Poets Newsletter
        </b-form-checkbox>
        <br>
        <b-form-checkbox
          v-model="list['educator-newsletter']"
          type="checkbox"
          id="aapen"
          class="newsletter-checkbox"
        >
          Academy of American Poets Educator Newsletter
        </b-form-checkbox>
        <br>
        <b-form-checkbox
          v-model="list['teach-this-poem']"
          type="checkbox"
          id="aapttp"
          class="newsletter-checkbox"
        >
          Teach This Poem
        </b-form-checkbox>
        <br>
        <b-form-checkbox
          v-model="list['poem-a-day']"
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
            :placeholder="placeholderEmail"
          />
          <b-btn
            class="btn btn-primary"
            type="submit"
          >
            submit
          </b-btn>
        </div>
      </app-form>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import Swal from "sweetalert2";
export default {
  components: {},
  data() {
    return {
      list: {
        "academy-newsletter": false,
        "educator-newsletter": false,
        "teach-this-poem": false,
        "poem-a-day": false
      },
      newsletterEmail: ""
    };
  },
  computed: {
    placeholderEmail() {
      return _.get(this.$auth, "user.meta.mail", "john@example.com");
    }
  },
  methods: {
    newsletterSignup() {
      const mailchimpBase = `${window.location.protocol}//${
        window.location.host
      }`;
      this.$axios({
        method: "post",
        baseURL: mailchimpBase,
        url: "/mailchimp",
        data: {
          email: this.newsletterEmail,
          list: _.keys(_.pickBy(this.list, item => item))
        }
      })
        .catch(error => {
          console.error(error);
          this.$sentry.captureException(error);
          Swal.fire(
            "Sorry!",
            "There was an error, please try again :(",
            "error"
          );
        })
        .then(result => {
          Swal.fire("Thanks!", "You are subscribed.", "success");
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.signup-title {
  font-size: 1.75rem;
  color: $gray-900;
}
.newsletter-checkbox {
  font-weight: 400;
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

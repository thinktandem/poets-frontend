<template>
  <div class="d-flex justify-content-center align-items-center">
    <b-button
      v-show="type === 'button'"
      class="mt-3 px-5 py-3"
      :variant="variant"
      size="lg"
      v-b-modal.submitEvent
      :to="to">{{ text }}</b-button>
    <b-button
      v-show="type === 'modal'"
      class="mt-3 px-5 py-3"
      :variant="variant"
      size="lg"
      v-b-modal="modal">
      {{ text }}</b-button>

    <b-modal
      centered
      header-border-variant="0"
      id="submitEvent"
      ref="submitEvent"
      lazy
      ok-only
      ok-title="Submit"
      :hide-header="!loggedIn"
      :hide-footer="!loggedIn"
      size="lg"
      @ok="submitEventStuff"
      title="submit an event">
      <Login
        v-show="!loggedIn"
        redirect="#"
        show-register-link
        title="Sign in or register to submit an event"/>
      <b-form v-show="loggedIn">
        <b-form-input
          type="text"
          placeholder="name" />
      </b-form>
    </b-modal>
  </div>
</template>
<script>
import _ from "lodash";
import Login from "~/components/Login";
export default {
  components: {
    Login
  },
  name: "ButtonBlock",
  props: {
    to: {
      type: String,
      default: "/"
    },
    modal: {
      type: String,
      default: "stuff"
    },
    text: {
      type: String,
      default: "Submit an Event"
    },
    type: {
      type: String,
      default: "button"
    },
    variant: {
      type: String,
      default: "primary-dark"
    }
  },
  computed: {
    loggedIn() {
      return this.$auth.loggedIn && !!_.get(this.$auth, "user.id", false);
    }
  },
  methods: {
    submitEventStuff(evt) {
      // Prevent the modal from auto-closing and disable the submit
      evt.preventDefault();
      // Add the poem to an anthology
      return this.$auth.user.createEvents(["FUCCCCCC"]).then(data => {
        console.log(data);
        this.$refs.submitEvent.hide();
      });
    }
  }
};
</script>

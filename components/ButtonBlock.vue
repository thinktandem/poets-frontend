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
      :ok-disabled="!eventSubmittable"
      ok-title="Submit"
      :hide-header="!loggedIn"
      :hide-footer="!loggedIn"
      size="lg"
      @ok="submitEventStuff"
      @shown="clearEventStuff"
      title="submit an event">
      <Login
        v-show="!loggedIn"
        redirect="#"
        show-register-link
        title="Sign in or register to submit an event"/>
      <b-form v-show="loggedIn">
        <b-form-input
          v-model="eventName"
          size="lg"
          :disabled="eventBusy"
          type="text"
          placeholder="Event name"
          :state="hasEventName" />
        <b-form-input
          v-model="eventEmail"
          size="lg"
          :disabled="eventBusy"
          type="email"
          placeholder="Contact email"
          :state="isEventEmail" />
        <b-form-input
          v-model="eventFee"
          size="lg"
          :disabled="eventBusy"
          type="text"
          placeholder="Fee"
          :state="isEventFee" />
      </b-form>
    </b-modal>
  </div>
</template>
<script>
import _ from "lodash";
import Login from "~/components/Login";
import utils from "~/plugins/auth-utils";
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
  data() {
    return {
      eventBusy: false,
      eventEmail: null,
      eventFee: null,
      eventName: null
    };
  },
  computed: {
    eventSubmittable() {
      return this.hasEventName && this.isEventEmail && this.isEventFee;
    },
    hasEventName() {
      return utils.getState(this.eventName);
    },
    isEventEmail() {
      return utils.isEmail(this.eventEmail) ? true : null;
    },
    isEventFee() {
      return utils.getState(this.eventFee);
    },
    loggedIn() {
      return this.$auth.loggedIn && !!_.get(this.$auth, "user.id", false);
    }
  },
  methods: {
    clearEventStuff() {
      this.eventName = null;
      this.eventEmail = null;
      this.eventFee = null;
      this.eventBusy = false;
    },
    submitEventStuff(evt) {
      // Prevent the modal from auto-closing and disable the submit
      this.eventBusy = true;
      evt.preventDefault();
      // Add the poem to an anthology
      return this.$auth.user
        .createEvents([
          { title: this.eventName, email: this.eventEmail, fee: this.eventFee }
        ])
        .then(data => {
          this.$toast.success(`Submitted ${this.eventName}!`).goAway(5000);
          this.$refs.submitEvent.hide();
        })
        .catch(error => {
          console.error(error);
          this.$toast.error("An error occurred!").goAway(3000);
          this.clearEventStuff();
        });
    }
  }
};
</script>

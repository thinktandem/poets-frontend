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
        redirect="false"
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
        <b-form-input
          v-model="eventDate"
          size="lg"
          :disabled="eventBusy"
          type="date"
          placeholder="Date"
          :state="hasEventDate"/>
        <b-form-input
          v-model="eventStreet"
          size="lg"
          :disabled="eventBusy"
          type="text"
          placeholder="Street"
          :state="hasEventStreet"/>
        <b-form-input
          v-model="eventCity"
          size="lg"
          :disabled="eventBusy"
          type="text"
          placeholder="City"
          :state="hasEventCity"/>
        <b-form-select
          v-model="eventState"
          size="lg"
          :disabled="eventBusy"
          :options="states"
          :state="hasEventState"
          class="mb-3">
          <template slot="first">
            <option
              :value="null"
              disabled>State</option>
          </template>
        </b-form-select>
        <b-form-input
          v-model="eventZip"
          size="lg"
          :disabled="eventBusy"
          type="number"
          placeholder="Zip Code"
          :state="hasEventZip"/>
        <b-form-textarea
          v-model="eventSummary"
          size="lg"
          :disabled="eventBusy"
          placeholder="Briefly describe your event..."
          rows="3"
          max-rows="6"/>
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
      eventDate: null,
      eventCity: null,
      eventEmail: null,
      eventFee: null,
      eventName: null,
      eventState: null,
      eventStreet: null,
      eventSummary: "",
      eventZip: null,
      states: this.$api.getStates()
    };
  },
  computed: {
    eventSubmittable() {
      return (
        this.hasEventName &&
        this.hasEventCity &&
        this.hasEventDate &&
        this.hasEventState &&
        this.hasEventStreet &&
        this.hasEventZip &&
        this.isEventEmail &&
        this.isEventFee
      );
    },
    hasEventCity() {
      return utils.getState(this.eventCity);
    },
    hasEventDate() {
      return utils.getState(this.eventDate);
    },
    isEventEmail() {
      return utils.isEmail(this.eventEmail) ? true : null;
    },
    isEventFee() {
      return utils.getState(this.eventFee);
    },
    hasEventName() {
      return utils.getState(this.eventName);
    },
    hasEventStreet() {
      return utils.getState(this.eventStreet);
    },
    hasEventState() {
      return utils.getState(this.eventState);
    },
    hasEventZip() {
      return utils.getState(this.eventZip) && this.eventZip.length === 5;
    },
    loggedIn() {
      return this.$auth.loggedIn && !!_.get(this.$auth, "user.id", false);
    }
  },
  methods: {
    clearEventStuff() {
      this.eventBusy = false;
      this.eventCity = null;
      this.eventDate = null;
      this.eventEmail = null;
      this.eventFee = null;
      this.eventName = null;
      this.eventState = null;
      this.eventStreet = null;
      this.eventSummary = "";
      this.eventZip = null;
    },
    submitEventStuff(evt) {
      // Prevent the modal from auto-closing and disable the submit
      this.eventBusy = true;
      evt.preventDefault();
      // Add the poem to an anthology
      return this.$auth.user
        .createEvents([
          {
            city: this.eventCity,
            date: this.eventDate,
            title: this.eventName,
            email: this.eventEmail,
            fee: this.eventFee,
            state: this.eventState,
            street: this.eventStreet,
            summary: this.eventSummary,
            zip: this.eventZip
          }
        ])
        .then(data => {
          this.$toast.success(`Submitted ${this.eventName}!`).goAway(5000);
          this.$refs.submitEvent.hide();
        })
        .catch(error => {
          this.$sentry.captureException(error);
          this.$toast
            .error(
              _.get(error, "data.errors[0].detail", "Something went wrong!")
            )
            .goAway(7777);
          console.error(error);
          this.clearEventStuff();
        });
    }
  }
};
</script>

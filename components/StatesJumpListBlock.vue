<template>
  <div
    class="d-flex justify-content-center align-items-center">
    <b-dropdown
      id="dropdown-buttons-states"
      text="Select a state"
      size="lg"
      :variant="variant"
      :states="states">
      <b-dropdown-item-button
        v-for="(state, i) in states"
        :key="i">
        <b-link
          :to="`/state/${state.text}`">
          {{ state.text }}
        </b-link>
      </b-dropdown-item-button>
    </b-dropdown>
  </div>
</template>
<script>
import _ from "lodash";

export default {
  components: {},
  name: "StatesJumpListBlock",
  props: {
    text: {
      type: String,
      default: "Submit an Event"
    },
    variant: {
      type: String,
      default: "primary-dark"
    }
  },
  data() {
    return {
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
          console.error(error);
          const message = _.get(
            error,
            "data.errors[0].detail",
            "Something went wrong!"
          );
          this.$sentry.captureException(new Error(message));
          this.$toast.error(message).goAway(7777);
          this.clearEventStuff();
        });
    }
  }
};
</script>

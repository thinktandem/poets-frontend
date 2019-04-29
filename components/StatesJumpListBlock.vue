<template>
  <div
    class="d-flex justify-content-center align-items-center">
    <b-button
      @click="showModal"
      class="mt-3 px-5 py-3"
      size="lg"
      variant="primary-dark"
    >{{ text }}</b-button>
    <b-modal
      title="Select a State"
      @ok="goToState"
      ok-title="Go!"
      :ref="`${this._uid}-modal`">
      <app-form>
        <b-form-select
          v-model="selectedState"
          :options="states"/>
      </app-form>
    </b-modal>
  </div>
</template>
<script>
export default {
  name: "StatesJumpListBlock",
  props: {
    text: {
      type: String,
      default: "Explore Your State"
    }
  },
  data() {
    return {
      states: this.$api.getStates(),
      selectedState: ""
    };
  },
  methods: {
    showModal() {
      this.$refs[`${this._uid}-modal`].show();
    },
    goToState(bvModalEvt) {
      // Stop the modal from doing its thang
      bvModalEvt.preventDefault();

      this.$router.push(`/state/${this.selectedState.toLowerCase()}`);
    }
  }
};
</script>

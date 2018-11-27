<template>
  <b-container tag="form">
    <h2>Form Elements</h2>
    <b-form-row>
      <b-form-group
        class="col-sm-6"
        description="This is the description of a normal input field."
        label="Text input"
        label-for="input-text"
        :invalid-feedback="invalidFeedback"
        :valid-feedback="validFeedback"
        :state="state"
      >
        <b-input
          id="input-text"
          type="text"
          placeholder="Enter your name"
          v-model.trim="name" />
      </b-form-group>
      <b-form-group
        class="col-sm-6"
        description="This is the description of an input field with an icon."
        label="Text input with icon"
        label-for="input-text"
        :invalid-feedback="invalidFeedback"
        :valid-feedback="validFeedback"
        :state="state"
      >
        <b-input
          id="input-text--icon"
          type="text"
          class="input--icon"
          placeholder="Search..."
          v-model.trim="name" />
        <svg
          xmlns="http://www.w3.org/2000/svg"><path
            d="M19.427 21.427a8.5 8.5 0 1 1 2-2l5.585 5.585c.55.55.546 1.43 0 1.976l-.024.024a1.399 1.399 0 0 1-1.976 0l-5.585-5.585zM14.5 21a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13z"
            fill="#000"
            fill-rule="evenodd"/></svg>
      </b-form-group>
    </b-form-row>
    <b-form-row>
      <b-form-group
        class="col-sm-6"
        description="This is the description of a textarea."
        label="Textarea label"
        label-for="textarea"
      >
        <b-form-textarea
          id="textarea"
          placeholder="Type some text here" />
      </b-form-group>
      <b-form-group
        class="col-sm-6"
        description="This is the description of a select list."
        label="Select label"
        label-for="select-list"
      >
        <b-form-select
          id="select-list"
          :options="selectOptions" />
      </b-form-group>
    </b-form-row>
    <b-form-row>
      <b-form-group
        class="col-sm-6"
        description="This is the description of the checkbox."
        label="Checkbox label"
        label-for="checkbox"
      >
        <b-form-checkbox-group
          id="checkbox"
          :options="checkboxRadioOptions"
          name="checkbox-group"
          v-model="selected"
          stacked />
      </b-form-group>
      <b-form-group
        class="col-sm-6"
        description="This is the description of the radios."
        label="Radio label"
        label-for="radios"
      >
        <b-form-radio-group
          id="radios"
          :options="checkboxRadioOptions"
          stacked />
      </b-form-group>
    </b-form-row>

  </b-container>
</template>

<script>
export default {
  computed: {
    state() {
      return this.name.length == 4 ? true : false;
    },
    invalidFeedback() {
      let msg = "";
      let nameLength = this.name.length;
      if (nameLength > 0 && nameLength < 5) {
        msg = "Enter exactly 4 characters";
      } else if (nameLength > 4) {
        msg = "That's too many characters";
      }
      return msg;
    },
    validFeedback() {
      return this.state === true ? "That's better" : "";
    }
  },
  data() {
    return {
      selected: [],
      name: "",
      selectOptions: [
        { value: null, text: "Please select an option" },
        { value: "a", text: "This is First option" },
        { value: "b", text: "Second Option" },
        { value: "d", text: "This one is disabled", disabled: true }
      ],
      checkboxRadioOptions: [
        { value: "a", text: "This is First option" },
        { value: "b", text: "Second Option" },
        { value: "d", text: "This one is disabled", disabled: true }
      ]
    };
  }
};
</script>

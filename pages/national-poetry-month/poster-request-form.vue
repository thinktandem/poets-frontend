<template>
  <div>
    <BasicPage
      :page-data="$store.state.pageData"
      highlighted=""/>
    <b-container>
      <b-row>
        <b-col xl="8">
          <form @submit="posterSubmit">
            <div
              class="poster__req-field poster__field">
              {{ res.first_name["#title"] }}
            </div>
            <b-form-input
              v-model="fname"
              type="text"
              placeholder="First Name"
              :required=true />
            <div
              class="poster__req-field poster__field">
              {{ res.last_name["#title"] }}
            </div>
            <b-form-input
              v-model="lname"
              type="text"
              placeholder="Last Name"
              :required=true />
            <div
              class="poster__req-field poster__field">
              {{ res.email["#title"] }}
            </div>
            <b-form-input
              v-model="email"
              type="email"
              placeholder="you@example.com"
              :required=true />
            <div
              class="poster__field">
              {{ res.company["#title"] }}
            </div>
            <b-form-input
              v-model="company"
              type="text"
              :required=true />
            <div
              class="poster__req-field poster__field">
              {{ res.address["#webform_composite_elements"].address["#title"] }}
            </div>
            <b-form-input
              v-model="address1"
              type="text"
              :required=true />
            <div
              class="poster__field">
              {{ res.address["#webform_composite_elements"].address_2["#title"] }}
            </div>
            <b-form-input
              v-model="city"
              type="select" />
            <div
              class="poster__req-field poster__field">
              {{ res.address["#webform_composite_elements"].state_province["#title"] }}
            </div>
            <b-form-select
              v-model="state_province"
              :options="res.address['#webform_composite_elements'].state_province['#options']"
              :required=true />
            <div
              class="poster__req-field poster__field">
              {{ res.address["#webform_composite_elements"].postal_code["#title"] }}
            </div>
            <b-form-input
              v-model="postal_code"
              type="text"
              :required=true />
            <div
              class="poster__field">
              {{ res.profession["#title"] }}
            </div>
            <b-form-select
              v-model="profession"
              :options="res.profession['#options']"/>
            <div
              class="poster__field">
              {{ res.if_you_re_a_teacher_what_grades_do_you_teach_["#title"] }}
            </div>
            <b-form-input
              v-model="grades_you_teach"
              type="text" />
            <b-form-group
              class="poster__field">
              {{ res.how_long_do_you_display_the_poster_in_your_school_["#title"] }}
              <b-form-radio-group
                v-model="how_long"
                stacked
                name="how_long"
                :options="res.how_long_do_you_display_the_poster_in_your_school_['#options']"/>
            </b-form-group>
            <div
              class="poster__field">
              {{ res.approximately_how_many_students_see_the_poster_["#title"] }}
            </div>
            <b-form-input
              v-model="how_many"
              type="number"
              min=0
              max=100000 />
            <div
              class="poster__field">
              {{ res.feedback["#title"] }}
            </div>
            <b-form-textarea
              v-model="feedback"
              rows="4"
              max-rows="10"/>
            <b-button
              class="poster__submit-button"
              type="submit"
              variant="primary">
              Send Request
            </b-button>
          </form>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import BasicPage from "~/components/BasicPage";

export default {
  layout: "default",
  components: {
    BasicPage
  },
  data() {
    return {
      res: {},
      fname: "",
      lname: "",
      email: "",
      company: "",
      address1: "",
      address2: "",
      city: "",
      state_province: [],
      postal_code: "",
      profession: [],
      grades_you_teach: "",
      how_long: "",
      how_many: "",
      feedback: ""
    };
  },
  async asyncData({ app, store, params, route, menu }) {
    return app.$axios
      .$get("/webform_rest/get_the_poster/fields?_format=json")
      .then(res => {
        return {
          res
        };
      })
      .catch(err => {
        console.log(err);
      });
  },
  async fetch({ app, store, route }) {
    return app.$buildBasicPage(app, store, route.path);
  },
  methods: {
    posterSubmit() {
      const body = {
        webform_id: "get_the_poster",
        first_name: this.fname,
        last_name: this.lname,
        email: this.email,
        company: this.company,
        address: {
          address: this.address1,
          address_2: this.city,
          state_province: this.state_province,
          postal_code: this.postal_code
        },
        profession: this.profession,
        if_you_re_a_teacher_what_grades_do_you_teach_: this.grades_you_teach,
        how_long_do_you_display_the_poster_in_your_school_: this.how_long,
        approximately_how_many_students_see_the_poster_: this.how_many,
        feedback: this.feedback
      };
      this.$axios
        .$post("/webform_rest/submit", body)
        .then(res => {
          console.log("Post webform_rest req sent.");
        })
        .catch(err => {
          console.log(err);
        });
      this.$toast
        .show("Thanks! Your request for a poster has been recieved", {
          theme: "toasted-primary",
          position: "top-left"
        })
        .goAway(1500);
    }
  }
};
</script>
<style>
.poster__field {
  margin-top: 8px;
  margin-bottom: 4px;
}
.poster__req-field:after {
  content: "*";
  color: var(--red-dark);
}
.poster__submit-button {
  margin-top: 18px;
}
</style>

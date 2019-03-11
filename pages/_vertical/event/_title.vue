<template>
  <div>
    <b-container class="py-5">
      <b-row>
        <b-col md="7">
          <h1>{{ title }}</h1>
          <b-img-lazy
            fluid
            center
            :src="image.src"
            :alt="image.alt"/>

          <div class="event__body">
            {{ body }}
          </div>
        </b-col>
        <b-col 
          md="4"
          offset-md="1">
          <div class="event-date-time my-5">
            <h3>Date and Time</h3>
            <p>{{ eventDate }}<br>
              {{ eventStartTime }} - {{ eventEndTime }}</p>
          </div>
          <div class="event-location my-5">
            <h3>Location</h3>
            <p>{{ locationAddress1 }}<br>
              {{ locationAddress2 }}<br>
              {{ locationLocality }}, {{ locationState }} {{ locationZip }}<br>
              <a href="#">View Map</a>
            </p>

            <b-button
              variant="primary-dark"
              size="lg"
              :href="registerLink.uri"
            >{{ registerLink.title }}</b-button>

          </div>

          <div class="event-registration my-5">
            <h3>Interested in being
            considered?</h3>
            <p>To be considered for #PoetryNearYou Pick of the Week, we invite you to become a registered user of Poets.org for free and to use our online calendar Poetry Near You to promote local events in your community.</p>
            <p>Admission Fee: <strong>$ {{ eventFee }}</strong><br>
              Contact: <a href="#">{{ contact }}</a><br>
              {{ eventDate }}</p>
          </div>
        </b-col>
      </b-row>
    </b-container>

    <b-container class="events-list tabular-list">
      <h2 class="font-serif">Poetry Near You</h2>
      list goes here
    </b-container>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  async asyncData({ app, route }) {
    const routerResponse = await app.$axios.$get(
      `/router/translate-path?path=${route.path}`
    );

    return app.$axios
      .$get(routerResponse.jsonapi.individual + "?include=field_image")
      .then(event => ({
        title: _.get(event, "data.attributes.title"),
        body: _.get(event, "data.attributes.body.processed"),
        eventDate: _.get(event, "data.attributes.field_event_date"),
        eventStartTime: _.get(event, "data.attributes.event_start_time"),
        eventEndTime: _.get(event, "data.attributes.event_end_time"),
        image: app.$buildImg(event, null, "field_image", "event"),
        contact: _.get(event, "data.attributes.field_event_contact"),
        eventFee: _.get(event, "data.attributes.field_event_fee"),
        registerLink: _.get(event, "data.attributes.register_link"),
        locationAddress1: _.get(
          event,
          "data.attributes.field_location.address_line1"
        ),
        locationAddress2: _.get(
          event,
          "data.attributes.field_location.address_line2"
        ),
        locationLocality: _.get(
          event,
          "data.attributes.field_location.locality"
        ),
        locationState: _.get(
          event,
          "data.attributes.field_location.administrative_area"
        ),
        locationZip: _.get(event, "data.attributes.field_location.postal_code")
      }));
  },
  async fetch({ store }) {
    store.commit("updateHero", {
      heading: "Poetry Near You",
      lead:
        "Are you looking to connect with poets or find opportunities to hear or study poetry? To find poetry events and resources near you, simply enter your zip code in the search field below."
    });
  }
};
</script>

<style scoped lang="scss">
.event__body {
  font-weight: 400;
  font-size: 1.2em;
}
.event-date-time {
}
.event-location {
}
.event-registration {
  background-color: var(--white);
  padding: 2rem;
  border: 1px solid var(--gray-900);
  font-weight: 400;
  font-size: 1.2em;
}
</style>

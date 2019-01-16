<template>
  <div role="tablist">
    <h3>Upcoming Events</h3>
    <b-card
      v-for="(event, i) in events"
      :key="`event${i}`"
      no-body
      class="mb-1 npm__events">
      <b-card-header
        header-tag="header"
        class="p-1"
        role="tab">
        <b-container>
          <b-row>
            <b-col
              class="npm__event-row-date"
              lg="3">
              {{ event.field_event_date }}
            </b-col>
            <b-col lg="6">
              <div
                v-html="event.title"
                class="npm__news-row-title"
                block
                href="#"
                v-b-toggle="`accordion${i}`"
                variant="info"/>
            </b-col>
            <b-col
              class="npm__event-row-location"
              lg="3">
              <span class="span-location">{{ event.nothing }}</span>
              <span class="plus"> + </span>
            </b-col>
          </b-row>
        </b-container>
      </b-card-header>
      <b-collapse
        :id="`accordion${i}`"
        accordion="my-accordion"
        role="tabpanel">
        <b-card-body>
          <p
            v-html="event.body"
            class="npm__events-row-body card-text"/>
        </b-card-body>
      </b-collapse>
    </b-card>
    <b-link
      class="npm__events-more-link"
      to="/national-poetry-month/events"
    >
      More Events >
    </b-link>
  </div>
</template>
<script>
import TwitterIcon from "~/static/social/twitter-just-bird.svg";

export default {
  components: {
    TwitterIcon
  },
  props: {
    events: {
      type: Object,
      default: () => {}
    }
  }
};
</script>
<style scoped lang="scss">
h3 {
  font-family: "Poets Electric";
  font-weight: 566;
  font-style: italic;
}
.npm__events {
  border-bottom: 1px solid var(--gray-600);
}
.npm__event-row-date {
  position: relative;
  top: 11px;
  color: var(--red-dark);
  font-weight: 400;
}
.npm__news-row-title {
  color: var(--blue-dark);
}
.npm__event-row-location {
  postition: relative;
  top: -7px;
  font-weight: 400;
}
.span-location {
  position: relative;
  top: -8px;
}
.plus {
  margin-left: 6px;
  font-size: 42px;
  color: var(--blue-dark);
}
.npm__event-row-body {
  font-weight: 400;
}
.npm__events-more-link {
  font-size: 20px;
}
</style>

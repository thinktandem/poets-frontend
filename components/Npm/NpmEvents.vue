<template>
  <div role="tablist">
    <h3>Upcoming Events</h3>
    <b-container>
      <b-row
        class="npm__events-header"
        lg="12">
        <b-col
          lg="3"
          class="npm__events-header-date">
          Date
        </b-col>
        <b-col
          lg="6"
          class="npm__events-header-event">
          Event
        </b-col>
        <b-col
          lg="3"
          class="npm__events-header-location">
          Location
        </b-col>
      </b-row>
    </b-container>
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
          <b-row
            v-b-toggle="`accordion${i}`"
          >
            <b-col
              class="npm__event-row-date"
              xl="3"
              lg="12">
              {{ event.field_event_date }}
            </b-col>
            <b-col
              xl="6"
              lg="12">
              <div
                v-html="event.title"
                class="npm__news-row-title"
                block
                href="#"
                variant="info"/>
            </b-col>
            <b-col
              class="npm__event-row-location"
              xl="3"
              lg="12">
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
          <b-container>
            <b-row>
              <b-col
                xl="8"
                lg="12"
              >
                <div
                  v-html="event.body"
                  class="npm__event-row-body card-text"/>
              </b-col>
              <b-col
                xl="4"
                lg="12"
                class="npm__event-expanded-location-data"
              >
                <div class="expanded-time">
                  {{ event.time }}<br>
                  -- SOME Theater --
                </div>
                <div class="expanded-address">
                  -- Place --<br>
                  -- 111 Some street --<br>
                  -- 09987 New York, New York ---
                </div>
                <div class="expanded-register-botton">
                  <b-button
                    v-if="event.register_link"
                    :href="event.register_link"
                    class="register-button">
                    Register
                  </b-button>
                </div>
                <div class="expanded-share">
                  share this event
                  <PoemActions
                    :poem="{
                      alias: event.view_node,
                      title: event.title
                    }"
                  />
                </div>
              </b-col>
            </b-row>
          </b-container>
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
import PoemActions from "~/components/PoemActions";

export default {
  components: {
    TwitterIcon,
    PoemActions
  },
  props: {
    events: {
      type: Array,
      default: () => []
    }
  }
};
</script>
<style scoped lang="scss">
.npm__events-header {
  border: 1px solid #eaf0f1;
  padding: 12px;
  background-color: #f2f8fa;
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 500;
  @media (max-width: 1200px) {
    display: none;
  }
}
h3 {
  font-family: "Poets Electric";
  font-weight: 566;
  font-style: italic;
}
.npm__events {
  font-family: "Founders Grotesk Text";
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
  font-weight: 600;
  @media (max-width: 1200px) {
    padding-top: 16px;
  }
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
.npm__event-expanded-location-data {
  font-size: 12px;
}
.expanded-time {
  font-weight: 600;
}
.register-button {
  margin-top: 12px;
  margin-bottom: 12px;
  background-color: var(--blue-dark);
  border: var(--blue-dark);
}
.expanded-share {
  font-weight: 600;
}
.npm__events-more-link {
  font-size: 20px;
}
</style>

<template>
  <div>
    <list-page
      :details="details"
      resource-type="events"
      :default-params="defaultParams"
      :includes="includes"
      :fields="fields"
      :filters="filters"
      :searchable="searchable"/>
    <card-deck
      class="py-4"
      col-size="md"
      :cards="poems.cards"
      cardtype="PoemCard"
      title="Poems"
      :link="poems.link"/>
    <card-deck
      class="py-4"
      col-size="md"
      :cards="poets.cards"
      cardtype="Poet"
      title="Poets"
      :link="poets.link"/>
  </div>
</template>

<script>
import _ from "lodash";
import CardDeck from "~/components/CardDeck";
import ListPage from "~/components/ListPage";
import MetaTags from "~/plugins/metatags";
export default {
  components: {
    CardDeck,
    ListPage
  },
  head() {
    return MetaTags.renderTags(this.$store.state.metatags);
  },
  data() {
    return {
      details: {
        body: {},
        event_start_time: {},
        field_location: {},
        register_link: {}
      },
      includes: {},
      fields: {
        field_event_date: { label: "Date" },
        title: { label: "Name" },
        field_location: { label: "Location" }
      },
      defaultParams: {},
      filters: [
        {
          id: "field_location.administrative_area",
          name: "State",
          options: this.$api.getStates()
        }
      ],
      searchable: [
        { field: "title", label: "title" },
        { field: "field_location.administrative_area", label: "state" },
        { field: "field_location.locality", label: "city" },
        { field: "field_location.postal_code", label: "zip code" },
        { field: "field_event_date", label: "date" }
      ]
    };
  },
  async asyncData({ app }) {
    const poems = await app.$axios
      .$get("/api/node/poems", {
        params: {
          include: "field_author",
          page: {
            limit: 3
          },
          sort: "promote"
        }
      })
      .then(response => ({
        link: {
          text: "More Poems",
          to: "/poems"
        },
        cards: _.map(response.data, poem => ({
          title: _.get(poem, "attributes.title"),
          link: _.get(poem, "attributes.path.alias", null),
          text: _.get(poem, "attributes.body.processed"),
          poet: {
            name: _.get(
              app.$getRelated(response, poem, "field_author"),
              "attributes.title"
            )
          },
          year: _.get(poem, "attributes.field_date_published")
            ? _.get(poem, "attributes.field_date_published", "-").split("-")[0]
            : null
        }))
      }));
    const poets = await app.$axios
      .$get("/api/node/person", {
        params: {
          filter: {
            field_p_type: "poet"
          },
          page: {
            limit: 3
          },
          sort: "promote",
          include: "field_image"
        }
      })
      .then(response => ({
        link: {
          text: "More Poets",
          to: "/poems"
        },
        cards: _.map(response.data, poet => ({
          name: _.get(poet, "attributes.title"),
          img: app.$buildImg(response, poet, "field_image", "portrait", {
            src: "/images/default-person.png",
            alt: _.get(poet, "attributes.title") + " portrait"
          }),
          bio:
            _.get(poet, "attributes.body.summary") ||
            _.get(poet, "attributes.body.processed"),
          link: _.get(poet, "attributes.path.alias")
        }))
      }));
    return { poems, poets };
  },
  async fetch({ app, store, route }) {
    return app.$buildBasicPage(app, store, route.path).then(() => {
      store.commit("updateSidebarData", [
        {
          // This gets the "Submit an Event" button.
          component: "ButtonBlock",
          props: {
            text: "Submit an Event",
            type: "modal",
            modal: "submitEvent"
          }
        },
        {
          // Add the browse States jump list dropdown menu.
          component: "StatesJumpListBlock",
          props: {
            text: "Select a state ..."
          }
        }
      ]);
    });
  }
};
</script><Paste>

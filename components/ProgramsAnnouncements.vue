<template>
  <section>
    <b-container>
      <b-row>
        <b-col md="6">
          <app-media-list
            :title="programOptions.title"
            :more-link="programOptions.moreLink" 
            :programs="programOptions.programs"/>
        </b-col>
        <b-col md="6">
          <app-announcements :announcements="announcements"/>
        </b-col>
      </b-row>
    </b-container>

  </section>
</template>

<script>
import AppMediaList from "~/components/AppMediaList";
import AppAnnouncements from "~/components/AppAnnouncements";

export default {
  name: "ProgramsAnnouncements",
  components: {
    AppMediaList,
    AppAnnouncements
  },
  props: {
    programOptions: {
      type: Object,
      default() {
        return {
          programs: [],
          moreLink: {},
          title: "Programs"
        };
      }
    },
    announcements: {
      type: Array,
      default: null
    }
  }
};
</script>

<style scoped>
</style>

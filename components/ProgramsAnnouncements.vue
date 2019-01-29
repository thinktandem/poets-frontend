<template>
  <section class="pt-4 pb-5">
    <b-container class="pt-1">
      <b-row>
        <b-col lg="8">
          <app-media-list
            class="program-list"
            :title="programOptions.title"
            :more-link="programOptions.moreLink" 
            :programs="programOptions.programs"/>
        </b-col>
        <b-col lg="4">
          <app-announcements 
            :announcements="announcements.announcements"
            :more-link="announcements.moreLink"/>
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
      type: Object,
      default: null
    }
  }
};
</script>

<style scoped lang="scss">
@include media-breakpoint-up(lg) {
  .program-list {
    padding-right: 10rem;
  }
}
</style>

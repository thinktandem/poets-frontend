<template>
  <div class="announcements p-4">
    <component 
      :is="titleTag" 
      class="font-serif announcements__title">Announcements</component>
    <app-announcement
      v-if="announcements.length >= 1"
      v-for="(announcement, index) in announcements.slice(0,3)"
      :key="index"
      :date="announcement.date"
      :title="announcement.title"
      :link="announcement.link"/>
    <div class="d-flex pt-4 flex-column align-items-end">
      <b-link
        v-if="announcements.length > 3"
        to="/announcements">More Announcements <chevron-right class="chevron"/></b-link>
    </div>
  </div>
</template>

<script>
import ChevronRight from "~/node_modules/open-iconic/svg/chevron-right.svg";
import AppAnnouncement from "~/components/AppAnnouncement";
export default {
  name: "AppAnnoucement",
  components: {
    AppAnnouncement,
    ChevronRight
  },
  props: {
    announcements: {
      type: Array,
      default() {
        return [];
      }
    },
    titleTag: {
      type: String,
      default: "h3"
    }
  }
};
</script>
<style scoped lang="scss">
.announcements__title {
  font-size: 2.65rem;
  line-height: 2.75rem;
}
.chevron {
  height: 10px;
  width: 10px;
  fill: $blue-light;
}
</style>

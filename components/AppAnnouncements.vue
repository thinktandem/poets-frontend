<template>
  <div class="announcements p-4">
    <h2 class="font-serif pb-3">Announcements</h2>
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
    }
  }
};
</script>
<style scoped lang="scss">
.chevron {
  height: 10px;
  width: 10px;
  fill: $blue-light;
}
</style>

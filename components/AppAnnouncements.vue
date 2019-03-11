<template>
  <div class="announcements py-4">
    <component
      :is="titleTag"
      class="font-serif announcements__title">Announcements</component>
    <ul class="pl-3 list-unstyled">
      <app-announcement
        v-if="announcements.length >= 1"
        v-for="(announcement, index) in announcements.slice(0,3)"
        :key="index"
        :date="announcement.date"
        :body="announcement.body"
        :link="announcement.link"/>
    </ul>
    <div class="d-flex pt-4 flex-column align-items-end">
      <b-link
        class="announcements__more-link"
        v-if="announcements.length > 3"
        :to="moreLink.to">{{ moreLink.text }} <chevron-right class="chevron"/></b-link>
    </div>
  </div>
</template>

<script>
import ChevronRight from "~/node_modules/open-iconic/svg/chevron-right.svg";
import AppAnnouncement from "~/components/AppAnnouncement";
export default {
  name: "AppAnnouncements",
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
    },
    moreLink: {
      type: Object,
      default() {
        return {
          to: "/announcements",
          text: "More Announcements"
        };
      }
    }
  }
};
</script>
<style scoped lang="scss">
.announcements__title {
  font-size: 2.65rem;
  line-height: 2.75rem;
}
.announcements__more-link {
  font-size: 1.25rem;
}
.chevron {
  height: 10px;
  width: 10px;
  fill: $blue-light;
}
</style>

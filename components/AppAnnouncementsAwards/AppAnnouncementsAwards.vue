<template>
  <b-container class="py-5">
    <b-row>
      <b-col md="8">
        <app-announcements v-bind="$store.state.announcements"/>
      </b-col>
      <b-col md="4">
        <AppAwards />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import AppAnnouncements from "~/components/AppAnnouncements";
import AppAwards from "~/components/AppAnnouncementsAwards/AppAwards";

export default {
  components: {
    AppAnnouncements,
    AppAwards
  }
};
</script>
<style scoped>
.announcements-awards {
  background-color: var(--gray-100);
}
</style>

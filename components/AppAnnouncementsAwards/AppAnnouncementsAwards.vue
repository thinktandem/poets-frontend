<template>
  <div
    class="p-4 announcements-awards">
    <b-container class="mx-auto my-1">
      <div class="row">
        <div class="col-8">
          <AppAnnouncements />
        </div>
        <div class="col">
          <AppAwards />
        </div>
      </div>
    </b-container>
  </div>
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

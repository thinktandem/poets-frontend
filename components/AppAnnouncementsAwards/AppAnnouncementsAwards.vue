<template>
  <div class="bg-white p-4">
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
import AppAnnouncements from "~/components/AppAnnouncementsAwards/AppAnnouncements";
import AppAwards from "~/components/AppAnnouncementsAwards/AppAwards";

export default {
  components: {
    AppAnnouncements,
    AppAwards
  }
};
</script>
<style scoped>
.promo__disclosure {
  color: var(--dark-muted);
  font-weight: 400;
}
</style>

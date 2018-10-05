<template>
  <div class="bg-white p-4">
    <h2>Announcements</h2>
    <div
      v-for="announcement in announcements"
      :key="announcement.link"
      class="announcement">
      <div class="announcement-date">
        {{ announcement.date }}
      </div>
      <div class="announcement-title">
        {{ announcement.title }}
      </div>
      <div class="announcement-read-more">
        <a href="announcemnt.link">read more</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  /**
   * @todo replace with real data/prop
   * @return {{ announcements: {date: string, title: string, link: string}[]}}
   */
  data() {
    return {
      announcements: [
        {
          date: "Aug 11, 2018",
          title: "A Letter from the Executive Director",
          link: "https://appUrl/announcementId"
        },
        {
          date: "Jul 31, 2018",
          title: "The Academy of American Poets Is Pleased to",
          link: "https://appUrl/announcementId"
        }
      ]
    };
  }
};
</script>
<style scoped>
.announcement {
  padding: 9px;
  border-bottom: 1px var(--gray-200) solid;
}
.announcement-date {
  color: var(--red);
}
</style>

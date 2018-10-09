<template>
  <div class="p-4">
    <h2 class="poets-electra">Announcements</h2>
    <div
      v-for="announcement in announcements"
      :key="announcement.link"
      class="announcement">
      <div class="announcement__date">
        {{ announcement.date }}
      </div>
      <div class="announcement__title">
        {{ announcement.title }}
      </div>
      <div class="announcement__read-more">
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
<style scoped lang="scss">
.announcement {
  padding: 9px;
  border-bottom: 1px var(--gray) solid;
  .announcement__date {
    color: var(--red);
  }
  .announcement__title {
    font-size: 26px;
    font-weight: 200;
  }
  .announcement__read-more {
    padding-top: 16px;
  }
}
.poets-electra {
  font-family: "Poets Electra Roman No 2";
  font-style: italic;
}
</style>

<template>
  <div class="announcemets p-4">
    <h2 class="poets-electra pb-3">Announcements</h2>
    <div
      v-for="announcement in announcements"
      :key="announcement.link"
      class="announcement pt-3">
      <div class="announcement__date pb-2">
        {{ announcement.date }}
      </div>
      <div class="announcement__title">
        {{ announcement.title }}
      </div>
      <div class="announcement__read-more pt-1 pb-3">
        <a :href="announcement.link">read more</a>
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
          title: `The Academy of American Poets Is Pleased to Announce the Winners of the Golden Shovel Anthology International Student Poetry Competition`,
          link: "https://appUrl/announcementId"
        }
      ]
    };
  }
};
</script>
<style scoped lang="scss">
.announcement {
  border-bottom: 1px var(--gray) solid;
  .announcement__date {
    color: var(--red);
    font-size: 14px;
    text-transform: uppercase;
  }
  .announcement__title {
    font-size: 26px;
    font-weight: 400;
  }
  .announcement__read-more {
    a {
      text-decoration: underline;
    }
  }
}
.poets-electra {
  font-family: $font-family-serif;
  font-style: italic;
}
</style>

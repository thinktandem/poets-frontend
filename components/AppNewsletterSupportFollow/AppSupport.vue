<template>
  <div class="support">
    <h3 class="signup-title">Support Us</h3>
    <div class="support__content">
      <ul>
        <li
          v-for="item in supportMenu"
          :key="item.id"
        >
          <a href="item.href">{{ item.title }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      supportMenu: [
        {
          title: "Become a Member",
          href: "blah/blah"
        },
        {
          title: "Donate Now",
          href: "/academy-american-poets/help-champion-poets-and-poetry"
        },
        {
          title: "Get Involved",
          href: "blah/blah"
        },
        {
          title: "Make a Bequest",
          href: "blah/blah"
        },
        {
          title: "Advertise with Us",
          href: "blah/blah"
        },
        {
          title: "Poets Shop",
          href: "blah/blah"
        }
      ]
    };
  },
  components: {}
};
</script>
<style lang="scss" scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    a {
      font-weight: 600;
      line-height: 2;
    }
  }
}
</style>

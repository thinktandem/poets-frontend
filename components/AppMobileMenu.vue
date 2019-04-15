<template lang="html">
  <b-list-group class="bg-dark menu--mobile">
    <b-list-group-item
      class="bg-dark"
      v-for="(item, index) in items"
      :key="index">
      <b-link
        v-b-toggle.nav_collapse
        class="bg-dark text-white"
        :to="item.to">{{ item.text }}</b-link>
      <a
        v-if="item.children"
        @click="item.open = !item.open">
        <drop-caret
          :class="{open: item.open}"
          class="text-white caret"/></a>
      <b-list-group
        class="border-top border-bottom border-primary py-3 sub-menu"
        v-show="item.open">
        <b-list-group-item
          class="bg-dark"
          v-for="(child, index) in item.children"
          :key="index">
          <b-link
            v-b-toggle.nav_collapse
            class="text-white"
            :to="child.to">
            {{ child.text }}
          </b-link>
        </b-list-group-item>
      </b-list-group>
    </b-list-group-item>
  </b-list-group>
</template>
<script>
import { map, merge } from "lodash";
import menu from "~/mobileMenu.json";
import DropCaret from "~/node_modules/open-iconic/svg/caret-bottom.svg";
export default {
  name: "AppMobileMenu",
  components: { DropCaret },
  data() {
    return {
      items: []
    };
  },
  created() {
    this.items = map(menu, link => merge(link, { open: false }));
  }
};
</script>

<style lang="scss" scoped>
.sub-menu {
  transition: all 0.5s;
}
.caret {
  transition: transform 0.1s;
  width: 1rem;
  height: 1rem;
  right: $spacer * 1;
  fill: white;
  position: absolute;
}
.open.caret {
  transform: scaleY(-1);
}
</style>

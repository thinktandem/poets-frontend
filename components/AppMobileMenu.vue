<template lang="html">
  <b-list-group class="bg-dark menu--mobile">
    <b-list-group-item
      class="bg-dark"
      v-for="(item, index) in items"
      :key="index">
      <b-link
        v-b-toggle.nav_collapse
        class="bg-dark text-white"
        v-if="!item.children"
        :to="item.to">{{ item.text }}
      </b-link>
      <span
        class="bg-dark text-white"
        v-if="item.children"
        @click="item.open = !item.open"
        disabled>{{ item.text }}
        <drop-caret
          :class="{open: item.open}"
          class="text-white caret"/>
      </span>

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
            @click="item.open = false"
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
    this.items = map(this.$store.state.mobileMenu, link =>
      merge(link, { open: false })
    );
  }
};
</script>

<style lang="scss" scoped>
.sub-menu {
  transition: all 0.5s;
  .list-group-item {
    font-weight: 200;
  }
  .list-group-item:first-child {
    font-weight: bold;
  }
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

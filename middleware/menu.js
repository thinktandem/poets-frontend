import menu from "~/menu.json";
import subMenu from "~/subMenu.json";
/**
 * @param {Object} context
 *   NuxtJS context
 * @return {void}
 */
export default function(context) {
  context.app.$buildMenu({ menu, route: context.route, store: context.store });
  context.app.$buildSubMenu({
    subMenu,
    route: context.route,
    store: context.store
  });
  context.store.commit("toggleSubMenu", true);
}

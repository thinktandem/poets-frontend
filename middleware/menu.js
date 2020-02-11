/**
 * @param {Object} context
 *   NuxtJS context
 * @return {void}
 */
export default function(context) {
  context.app.$buildMenu({ route: context.route, store: context.store });
  context.app.$buildSubMenu({
    route: context.route,
    store: context.store
  });
  context.store.commit("toggleSubMenu", true);
}

import menu from "~/menu.json";
/**
 * @param {Object} context
 *   NuxtJS context
 * @return {void}
 */
export default function(context) {
  context.menu = menu;
  console.log("menu is", menu);
}

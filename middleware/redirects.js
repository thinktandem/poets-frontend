import redirects from "~/redirects.json";
/**
 * @param {Object} context
 *  the nuxt context, see https://nuxtjs.org/api/context
 * @return {mixed}.
 */
export default function({ redirect, route }) {
  const thisRedirect = redirects.find(r => r.from === req.url);
  const poetsorgPattern = RegExp("/poetsorg/");
  const homePattern = RegExp("/home");
  if (thisRedirect) {
    console.log(`redirect: ${redirect.from} => ${redirect.to}`);
    return redirect(thisRedirect.to);
  } else if (poetsorgPattern.test(route.path)) {
    return redirect(route.path.replace("/poetsorg/", "/"));
  } else if (homePattern.test(route.path)) {
    return redirect(route.path.replace("/home", "/"));
  }
}

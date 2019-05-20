import qs from "qs";
import { isEmpty, filter } from "lodash";
import redirects from "~/redirects.json";
/**
 * @param {Object} context
 *  the nuxt context, see https://nuxtjs.org/api/context
 * @return {mixed}.
 */
export default function({ redirect, route, query }) {
  const thisRedirect = redirects.find(r => r.from === route.path);
  const poetsorgPattern = RegExp("/poetsorg/");
  const lessonPattern = RegExp("/lesson/");
  const homePattern = RegExp("/home$");
  const oldPhpPaths = [
    "store.php",
    "page.php",
    "lit",
    "audio.php",
    "booth",
    "viewmedia.php",
    "viewall.php",
    "viewevent.php",
    "sponsor-book-profile.php"
  ];

  // Handle query params so they don't get stripped
  const paramString = isEmpty(query) ? "" : `?${qs.stringify(query)}`;

  if (thisRedirect) {
    console.log(`redirect: ${redirect.from} => ${redirect.to}`);
    return redirect(thisRedirect.to + paramString);
  } else if (poetsorgPattern.test(route.path)) {
    return redirect(route.path.replace("/poetsorg/", "/") + paramString);
  } else if (lessonPattern.test(route.path)) {
    return redirect(
      route.path.replace("/lesson/", "/lesson-plan/") + paramString
    );
  } else if (homePattern.test(route.path)) {
    return redirect(route.path.replace("/home", "/") + paramString);
  } else if (
    filter(oldPhpPaths, path => route.path.includes(path)).length >= 1
  ) {
    return redirect("/");
  }
}

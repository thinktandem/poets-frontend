import qs from "qs";
import { isEmpty, filter } from "lodash";
import redirects from "~/redirects.json";
import legacyRedirects from "~/legacy-redirects.json";
/**
 * @param {Object} context
 *  the nuxt context, see https://nuxtjs.org/api/context
 * @return {mixed}.
 */
export default function({ redirect, route, query }) {
  // Check if the URL string has accents like: aimé-césaire
  // https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript/37511463#37511463
  const normedPath = decodeURI(route.path)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (normedPath !== route.path) {
    return redirect(normedPath);
  }
  const thisRedirect = redirects.find(r => r.from === route.path);
  const oldRedirects = legacyRedirects.find(r => r.from === route.path);
  const poetsorgPattern = RegExp("/poetsorg/");
  const lessonPattern = RegExp("/lesson/");
  const homePattern = RegExp("/home$");
  const oldPhpPaths = [
    "store.php",
    "page.php",
    "audio.php",
    "viewmedia.php",
    "viewall.php",
    "viewevent.php",
    "sponsor-book-profile.php"
  ];

  // Handle query params so they don't get stripped
  const paramString = isEmpty(query) ? "" : `?${qs.stringify(query)}`;

  if (thisRedirect) {
    return redirect(thisRedirect.to + paramString);
  } else if (oldRedirects) {
    return redirect(oldRedirects.to + paramString);
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

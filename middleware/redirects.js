import qs from "qs";
import { isEmpty, filter } from "lodash";
import redirects from "~/redirects.json";
import legacyRedirects from "~/legacy-redirects.json";
import { transliterate as tr } from "transliteration";

/**
 * @param {Object} context
 *  the nuxt context, see https://nuxtjs.org/api/context
 * @return {mixed}.
 */
export default function({ redirect, route, query }) {
  const thisRedirect = redirects.find(r => r.from === route.path);
  const oldRedirects = legacyRedirects.find(r => r.from === route.path);
  const poetsorgPattern = RegExp("/poetsorg/");
  const lessonPattern = RegExp("/lesson/");
  const listingPattern = RegExp("/listing/");
  const stanzaPattern = RegExp("/stanza/");
  const homePattern = RegExp("/home$");
  const textPattern = RegExp("/text/");
  const oldPhpPaths = [
    "store.php",
    "page.php",
    "audio.php",
    "viewmedia.php",
    "viewall.php",
    "viewevent.php",
    "sponsor-book-profile.php",
    "search.php"
  ];

  // Catch the case that the passed in URL needs transliteration.
  if (trUrl(route.path) !== route.path && !thisRedirect) {
    redirect(trUrl(route.path));
  }

  // Handle query params so they don't get stripped
  const paramString = isEmpty(query) ? "" : `?${qs.stringify(query)}`;

  if (thisRedirect) {
    return redirect(trUrl(thisRedirect.to).replace("'", "") + paramString);
  } else if (oldRedirects) {
    return redirect(trUrl(oldRedirects.to) + paramString);
  } else if (poetsorgPattern.test(route.path)) {
    return redirect(route.path.replace("/poetsorg/", "/") + paramString);
  } else if (lessonPattern.test(route.path)) {
    return redirect(
      trUrl(route.path.replace("/lesson/", "/lesson-plan/")) + paramString
    );
  } else if (listingPattern.test(route.path)) {
    return redirect(
      trUrl(
        route.path.replace("/academy-american-poets/listing/", "/listing/")
      ) + paramString
    );
  } else if (stanzaPattern.test(route.path)) {
    return redirect(trUrl(route.path.replace("/stanza/", "/")) + paramString);
  } else if (homePattern.test(route.path) && route.path !== "/poem/home") {
    return redirect(trUrl(route.path.replace("/home", "/")) + paramString);
  } else if (textPattern.test(route.path)) {
    return redirect(
      trUrl(route.path.replace("/national-poetry-month/text/", "/text/")) +
        paramString
    );
  } else if (
    filter(oldPhpPaths, path => route.path.includes(path)).length >= 1
  ) {
    return redirect("/");
  }
}

/**
 * Transiliterate a url if it needs it.
 *
 * @param {String} route the route.path from the router.
 *
 * @return {String} transliterated string.
 */
function trUrl(route) {
  // Check if the URL string has special characters like: aimé-césaire
  const normedPath = tr(decodeURI(route));
  if (normedPath !== decodeURI(route)) {
    return normedPath;
  } else {
    return decodeURI(route);
  }
}

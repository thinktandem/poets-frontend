import qs from "qs";
import { isEmpty } from "lodash";
import { transliterate as tr } from "transliteration";

/**
 * @param {Object} context
 *  the nuxt context, see https://nuxtjs.org/api/context
 * @return {mixed}.
 */
export default function({ redirect, route, query }) {
  const poetsorgPattern = RegExp("/poetsorg/");
  const lessonPattern = RegExp("/lesson/");
  const listingPattern = RegExp("/listing/");
  const stanzaPattern = RegExp("/stanza/");
  const homePattern = RegExp("/home$");
  const textPattern = RegExp("/national-poetry-month/text/");

  // Catch the case that the passed in URL needs transliteration.
  if (trUrl(route.path) !== route.path) {
    redirect([301], trUrl(route.path));
  }

  // Handle query params so they don't get stripped
  const paramString = isEmpty(query) ? "" : `?${qs.stringify(query)}`;

  if (poetsorgPattern.test(route.path)) {
    return redirect([301], route.path.replace("/poetsorg/", "/") + paramString);
  } else if (lessonPattern.test(route.path)) {
    return redirect(
      [301],
      trUrl(route.path.replace("/lesson/", "/lesson-plan/")) + paramString
    );
  } else if (listingPattern.test(route.path)) {
    return redirect(
      [301],
      trUrl(
        route.path.replace("/academy-american-poets/listing/", "/listing/")
      ) + paramString
    );
  } else if (stanzaPattern.test(route.path)) {
    return redirect(
      [301],
      trUrl(route.path.replace("/stanza/", "/")) + paramString
    );
  } else if (homePattern.test(route.path) && route.path !== "/poem/home") {
    return redirect(
      [301],
      trUrl(route.path.replace("/home", "/")) + paramString
    );
  } else if (textPattern.test(route.path)) {
    return redirect(
      [301],
      trUrl(route.path.replace("/national-poetry-month/text/", "/text/")) +
        paramString
    );
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

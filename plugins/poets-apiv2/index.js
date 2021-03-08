import _ from "lodash";
import qs from "qs";
import anthologies from "~/plugins/poets-apiv2/lib/anthologies";
import events from "~/plugins/poets-apiv2/lib/events";
import isa from "~/plugins/poets-apiv2/lib/isa";
import magazines from "~/plugins/poets-apiv2/lib/magazines";
import poems from "~/plugins/poets-apiv2/lib/poems";
import poets from "~/plugins/poets-apiv2/lib/poets";
import persons from "~/plugins/poets-apiv2/lib/persons";
import search from "~/plugins/poets-apiv2/lib/search";
import taxonomies from "~/plugins/poets-apiv2/lib/taxonomies";
import user from "~/plugins/poets-apiv2/lib/user";

/**
 * @file
 * Version 2 node client for Poets API
 */

// Post request config
const defaultRequestOptions = {
  headers: {
    "Content-Type": "application/vnd.api+json"
  }
};

// Helper to build a url
const buildUrl = (url, query = {}) => {
  if (!_.isEmpty(query)) {
    const queryString = qs.stringify(query);
    url = `${url}?${queryString}`;
  }
  return url;
};

// Helper to process a request
const request = axios => {
  return (
    url,
    data = {},
    { method = "get", query = {}, options = {}, params = {} } = {}
  ) => {
    return axios[method](
      buildUrl(url, query),
      { data },
      _.merge({}, defaultRequestOptions, options, { params })
    );
  };
};

/**
 * PoetsAPI
 */
export default class PoetsApi {
  /**
   * Constructor
   *
   * @param {Object} axios library
   * @param {Object} options
   */
  constructor(axios, options = {}) {
    this.request = request(axios);
    this.options = options;
  }

  /**
   * Create Anthologies
   *
   * @param {Object|Array} data An object or array of objects
   * @param {Object} options Options
   * @return {Object} the response object
   */
  createAnthologies(data, options = {}) {
    return anthologies.create(this.request, data, options);
  }

  /**
   * Create Events
   *
   * @param {Object|Array} data An object or array of objects
   * @param {Object} options Options
   * @return {Object} the response object
   */
  createEvents(data, options = {}) {
    return events.create(this.request, data, options);
  }

  /**
   * Get Intertitial CTA; isa
   *
   * @param {Object} options
   * @return {Object} the response object
   */
  getIsa(options = {}) {
    return isa.getIsa(this.request, options);
  }

  /**
   * Create Anthologies
   *
   * @param {Object|Array} data An object or array of objects
   * @param {Object} options Options
   * @return {Object} the response object
   */
  deleteAnthologies(data, options = {}) {
    return anthologies.remove(this.request, data, options);
  }

  /**
   * Get Anthologies
   *
   * @param {Object} options
   * @return {Object} the response object
   */
  getAnthologies(options = {}) {
    return anthologies.get(this.request, options);
  }

  /**
   * Get poem metadata for a given anythology
   *
   * @param {String} id
   * @param {Object} options
   * @return {Object} the response object
   */
  getAnthologyPoems(id, options = {}) {
    return anthologies.getPoemMeta(this.request, id, options);
  }

  /**
   * Get latest magazine
   *
   * @param {Object} options
   * @return {Object} the response object
   */
  getLatestMagazine(options = {}) {
    return magazines.getLatestMagazine(this.request, options);
  }

  /**
   * Get magazines
   *
   * @param {Object} options
   * @return {Object} the response object
   */
  getMagazines(options = {}) {
    return magazines.getMagazines(this.request, options);
  }

  /**
   * Get poem a day
   *
   * @param {Object} options
   * @return {Object} the response object
   */
  getPoemADay(options = {}) {
    return poems.getPoemADay(this.request, options);
  }

  /**
   * Get poems
   *
   * @param {Object} options
   * @return {Object} the response object
   */
  getPoems(options = {}) {
    return poems.getPoems(this.request, options);
  }

  /**
   * Get poets
   *
   * @param {Object} options
   * @return {Object} the response object
   */
  getFeaturedPoets(options = {}) {
    return poets.getFeaturedPoets(this.request, options);
  }

  /**
   * Get poets
   *
   * @param {Object} options
   * @return {Object} the response object
   */
  getPoets(options = {}) {
    return poets.getPoets(this.request, options);
  }

  /**
   * Get chancellors
   *
   * @param {Object} options
   * @return {Object} the response object
   */
  getPersons(options = {}) {
    return persons.getPersons(this.request, options);
  }

  /**
   * Get states
   * @TODO: probably is a better place for this?
   *
   * @param {String} term
   * @param {Object} options
   * @param {String} type
   * @return {Object} the response object
   */
  getStates() {
    return [
      { value: "AL", text: "Alabama" },
      { value: "AK", text: "Alaska" },
      { value: "AS", text: "American Samoa" },
      { value: "AZ", text: "Arizona" },
      { value: "AR", text: "Arkansas" },
      {
        value: "AE",
        text: "Armed Forces (Canada, Europe, Africa, or Middle East"
      },
      { value: "AA", text: "Armed Forces Americas" },
      { value: "AP", text: "Armed Forces Pacific" },
      { value: "CA", text: "California" },
      { value: "CO", text: "Colorado" },
      { value: "CT", text: "Connecticut" },
      { value: "DE", text: "Delaware" },
      { value: "DC", text: "District of Columbia" },
      { value: "FL", text: "Florida" },
      { value: "GA", text: "Georgia" },
      { value: "GU", text: "Guam" },
      { value: "HI", text: "Hawaii" },
      { value: "ID", text: "Idaho" },
      { value: "IL", text: "Illinois" },
      { value: "IN", text: "Indiana" },
      { value: "IA", text: "Iowa" },
      { value: "KS", text: "Kansas" },
      { value: "KY", text: "Kentucky" },
      { value: "LA", text: "Louisiana" },
      { value: "ME", text: "Maine" },
      { value: "MH", text: "Marshall Islands" },
      { value: "MD", text: "Maryland" },
      { value: "MA", text: "Massachusetts" },
      { value: "MI", text: "Michigan" },
      { value: "MN", text: "Minnesota" },
      { value: "MS", text: "Mississippi" },
      { value: "MO", text: "Missouri" },
      { value: "MT", text: "Montana" },
      { value: "NE", text: "Nebraska" },
      { value: "NV", text: "Nevada" },
      { value: "NH", text: "New Hampshire" },
      { value: "NJ", text: "New Jersey" },
      { value: "NM", text: "New Mexico" },
      { value: "NY", text: "New York" },
      { value: "NC", text: "North Carolina" },
      { value: "ND", text: "North Dakota" },
      { value: "MP", text: "Northern Mariana Islands" },
      { value: "OH", text: "Ohio" },
      { value: "OK", text: "Oklahoma" },
      { value: "OR", text: "Oregon" },
      { value: "PW", text: "Palau" },
      { value: "PA", text: "Pennsylvania" },
      { value: "PR", text: "Puerto Rico" },
      { value: "RI", text: "Rhode Island" },
      { value: "SC", text: "South Carolina" },
      { value: "SD", text: "South Dakota" },
      { value: "TN", text: "Tennessee" },
      { value: "TX", text: "Texas" },
      { value: "UT", text: "Utah" },
      { value: "VT", text: "Vermont" },
      { value: "VI", text: "Virgin Islands" },
      { value: "VA", text: "Virginia" },
      { value: "WA", text: "Washington" },
      { value: "WV", text: "West Virginia" },
      { value: "WI", text: "Wisconsin" },
      { value: "WY", text: "Wyoming" }
    ];
  }

  /**
   * Get terms
   *
   * @param {String} term
   * @param {Object} options
   * @param {String} type
   * @return {Object} the response object
   */
  getTerm(term, options = {}, type = "taxonomy_term") {
    return taxonomies.getTerm(this.request, term, options, type);
  }

  /**
   * Get term tid
   *
   * @param {String} filter the vocabulary
   * @param {String} term
   * @param {Object} options query object
   * @param {String} type the taxonomy type
   * @return {String} the term tid
   */
  getTermId(filter, term, options = {}, type = "taxonomy_term") {
    return taxonomies.getTermId(this.request, filter, term, options, type);
  }

  /**
   * Search search by query
   *
   * @param {Object} options
   * @return {Integer} the response object
   */
  search(options = {}) {
    return search.search(this.request, options);
  }

  /**
   * Search audio by query
   *
   * @param {Object} options
   * @return {Integer} the response object
   */
  searchAudio(options = {}) {
    return search.audio(this.request, options);
  }

  /**
   * Search books by query
   *
   * @param {Object} options
   * @return {Integer} the response object
   */
  searchBooks(options = {}) {
    return search.books(this.request, options);
  }

  /**
   * Search jobs by query
   *
   * @param {Object} options
   * @return {Integer} the response object
   */
  searchJobs(options = {}) {
    return search.jobs(this.request, options);
  }

  /**
   * Search plans by query
   *
   * @param {Object} options
   * @return {Integer} the response object
   */
  searchLessonPlans(options = {}) {
    return search.lessonPlans(this.request, options);
  }

  /**
   * Search poems by query
   *
   * @param {Object} options
   * @return {Integer} the response object
   */
  searchPoems(options = {}) {
    return search.poems(this.request, options);
  }

  /**
   * Search poets by query
   *
   * @param {Object} options
   * @return {Integer} the response object
   */
  searchPoets(options = {}) {
    return search.poets(this.request, options);
  }

  /**
   * Search press center by query
   *
   * @param {Object} options
   * @return {Integer} the response object
   */
  searchPressCenter(options = {}) {
    return search.pressCenter(this.request, options);
  }

  /**
   * Search previous poems a day by query
   *
   * @param {Object} options
   * @return {Integer} the response object
   */
  searchPreviousPoemsADay(options = {}) {
    return search.previousPoemsADay(this.request, options);
  }

  /**
   * Search texts by query
   *
   * @param {Object} options
   * @return {Integer} the response object
   */
  searchTexts(options = {}) {
    return search.texts(this.request, options);
  }

  /**
   * Update Anthologies
   *
   * @param {Object|Array} data An object or array of objects
   * @param {Object} options Options
   * @return {Object} the response object
   */
  updateAnthologies(data, options = {}) {
    return anthologies.update(this.request, data, options);
  }

  /**
   * Get Anthologies
   *
   * @param {String} id the user id
   * @param {Object} options
   * @return {Object} the response object
   */
  getUser(id, options = {}) {
    return user.get(this.request, id, options);
  }
}

import _ from "lodash";

/**
 * @file
 * Higher level wrapper to easily handle manipulating user data
 */

// Helper to get poem data
const getPoems = (poems = []) =>
  _(poems)
    .map(poem => _.get(poem, "id"))
    .value();

// Helper to build a new anthology
const getAnthology = (id, title, poems = []) => ({ id, title, poems });

/**
 * PoetsAPI
 */
export default class PoetsUser {
  /**
   * Constructor
   *
   * @param {Object} id User id
   * @param {Object} api A PoetsApi
   * @param {Object} meta Additional user metadata
   */
  constructor(id, api, meta = {}) {
    this.id = id;
    this.api = api;
    this.meta = meta;
    this.anthologies = [];
  }

  /**
   * Add a poem to an anthology
   *
   * @param {String} anthology UUID of the anthology
   * @param {String} poem UUID of the poem
   */
  addPoem(anthology, poem) {
    _.find(this.anthologies, { id: anthology }).poems.push(poem);
  }

  /**
   * Remove a poem frin an anthology
   *
   * @param {String} anthology UUID of the anthology
   * @param {String} poem UUID of the poem
   */
  removePoem(anthology, poem) {
    console("removing poem");
  }

  /**
   * create Anthologies
   *
   * @param {Array} titles Create new anthologies
   * @return {Object} the response object
   */
  createAnthologies(titles = []) {
    return this.api
      .createAnthologies(_.map(titles, title => ({ title })))
      .then(anthologies => {
        // Map to more useful data
        const newAnths = _(anthologies)
          .map(anthology => _.get(anthology, "data.data", {}))
          .map(anthology =>
            getAnthology(
              _.get(anthology, "id"),
              _.get(anthology, "attributes.title"),
              getPoems(_.get(anthology, "relationships.field_poems.data", []))
            )
          )
          .value();
        // Update our anthologies with new stuff
        _.forEach(newAnths, newAnth => {
          this.anthologies.push(newAnth);
        });
        // Return
        return newAnths;
      });
  }

  /**
   * Get Anthologies
   *
   * @param {Boolean} force Get the list from the API
   * @return {Object} the response object
   */
  getAnthologies(force = false) {
    // Return cached list if we have it and we arent forcing a call
    if (!_.isEmpty(this.anthologies) && !force) {
      return Promise.resolve(this.anthologies);
    }

    // Otherwise get it from the API
    return this.api
      .getAnthologies({ query: { filter: { "uid.id": this.id, status: 1 } } })
      .then(anthologies => {
        this.setAnthologies(
          _(_.get(anthologies, "data.data", []))
            .map(data =>
              getAnthology(
                _.get(data, "id"),
                _.get(data, "attributes.title"),
                getPoems(_.get(data, "relationships.field_poems.data", []))
              )
            )
            .value()
        );
        return this.anthologies;
      });
  }

  /**
   * Set Anthologies
   *
   * @param {Object} anthologies
   */
  setAnthologies(anthologies = []) {
    this.anthologies = anthologies;
  }

  /**
   * Set Metadata
   *
   * @param {Object} data User metadata
   */
  setMeta(data = {}) {
    this.meta = data;
  }

  /**
   * Update Anthologies
   *
   * @param {Array} ids An array of UUIDS to update
   * @return {Object} the response object
   */
  updateAnthologies(ids = []) {
    const data = _.isEmpty(ids)
      ? this.anthologies
      : _.filter(this.anthologies, anthology => _.includes(ids, anthology.id));
    return this.api.updateAnthologies(data);
  }

  /**
   * Get the user metadata
   *
   * @return {Object} the response object
   */
  getUser() {
    return _.merge(
      {},
      this.meta,
      { anthologies: this.anthologies },
      { id: this.id },
      { $user: this }
    );
  }
}

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
const getAnthology = (id, title, link, poems = []) => ({
  id,
  title,
  link,
  poems
});

// Helper to determine whether we have a serial ID or UUID
const getIdType = id => {
  if (_.size(id.split("-")) === 5) return "uuid";
  else return "serial";
};

// Helper to get pullUser request data
const getPullUserOpts = (id, type = "uuid") => ({
  id: type === "uuid" ? id : null,
  query: type === "uuid" ? {} : { query: { filter: { uid: id } } },
  idPath: type === "uuid" ? "data.data.id" : "data.data[0].id",
  attrPath: type === "uuid" ? "data.data.attributes" : "data.data[0].attributes"
});

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
    this.events = [];
    this.idType = getIdType(this.id);
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
              _.get(anthology, "attributes.path.alias"),
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
   * create events
   *
   * @param {Array} titles Create new events
   * @return {Object} the response object
   */
  createEvents(titles = []) {
    return this.api
      .createEvents(_.map(titles, title => ({ title })))
      .then(events => {
        // Map to more useful data
        const newEvents = _(events)
          .map(event => _.get(event, "data.data", {}))
          .map(event =>
            getAnthology(
              _.get(event, "id"),
              _.get(event, "attributes.title"),
              _.get(event, "attributes.path.alias")
            )
          )
          .value();
        // Update our events with new stuff
        _.forEach(newEvents, newEvent => {
          this.events.push(newEvent);
        });
        // Return
        return newEvents;
      });
  }

  /**
   * Get the user metadata
   *
   * @return {Object} the response object
   */
  getUser() {
    return _.pickBy(
      _.merge({}, this.meta, { anthologies: this.anthologies }, { id: this.id })
    );
  }

  /**
   * Pull udpated Anthologies from the API
   *
   * @param {Boolean} force Get the list from the API
   * @return {Object} the response object
   */
  pullAnthologies(force = false) {
    // Return cached list if we have it and we arent forcing a call
    if (!_.isEmpty(this.anthologies) && !force) {
      return Promise.resolve(this.anthologies);
    }

    // Otherwise get it from the API
    return this.api
      .getAnthologies({ query: { filter: { "uid.id": this.id, status: 1 } } })
      .then(anthologies => {
        this.updateAnthologies(
          _(_.get(anthologies, "data.data", []))
            .map(data =>
              getAnthology(
                _.get(data, "id"),
                _.get(data, "attributes.title"),
                _.get(data, "attributes.path.alias"),
                getPoems(_.get(data, "relationships.field_poems.data", []))
              )
            )
            .value()
        );
        return this.anthologies;
      });
  }

  /**
   * Push local Anthologies to the API
   *
   * @param {Array} ids An array of UUIDS to update
   * @return {Object} the response object
   */
  pushAnthologies(ids = []) {
    const data = _.isEmpty(ids)
      ? this.anthologies
      : _.filter(this.anthologies, anthology => _.includes(ids, anthology.id));
    return this.api.updateAnthologies(data);
  }

  /**
   * Pull data about the user from the API and set it locally
   *
   * @param {Array} ids An array of UUIDS to update
   * @return {Object} the response object
   */
  pullUser() {
    const opts = getPullUserOpts(this.id, this.idType);
    return this.api
      .getUser(opts.id, opts.query)
      .then(response =>
        _.merge(
          {},
          { id: _.get(response, opts.idPath) },
          _.get(response, opts.attrPath)
        )
      )
      .then(user => {
        this.updateUser({ id: user.id, meta: user });
        return this;
      });
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
   * Set Anthologies locally
   *
   * @param {Object} anthologies
   */
  updateAnthologies(anthologies = []) {
    this.anthologies = anthologies;
  }

  /**
   * Set user metadata locally
   *
   * @param {Object} data User metadata
   */
  updateUser({ id = this.id, meta = this.meta } = {}) {
    this.id = id;
    this.meta = meta;
    this.idType = getIdType(this.id);
  }
}

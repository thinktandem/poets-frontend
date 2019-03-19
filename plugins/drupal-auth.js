import _ from "lodash";
import PoetsApi from "~/plugins/poets-apiv2";
import PoetsUser from "~/plugins/poets-user";

/*
 * Helper to build token
 */
const buildToken = (token, type = "Bearer") => type + " " + token;

/*
 * Helper to parse base64 datas
 */
const base64decode = data => {
  try {
    return JSON.parse(new Buffer(data, "base64").toString());
  } catch (error) {
    return undefined;
  }
};

/*
 * Helper to validate auth
 */
const validateAuth = auth => {
  // Return if this is server side for whatever reason
  if (process.server) {
    return false;
  }

  // Redirect if empty or not an object
  if (auth === undefined || !_.isObject(auth)) {
    return false;
  }

  // Make sure we have all the required properties and they are set to something
  _.forEach(["access_token", "expires_in", "token_type", "user"], key => {
    if (!_.has(auth, key) || _.isNil(auth[key])) {
      return false;
    }
  });

  // I guess we are good!
  return true;
};

/*
 * Helper to validate whether user is fetchable
 */
const validateFetchable = (user, env = process.env) =>
  _.has(user, "id") && _.has(env, "baseURL");

/**
 * A Drupal login scheme for nuxt auth module
 */
export default class DrupalScheme {
  /**
   * Build me a DrupalScheme worthy of nuxt auth-module
   *
   * @param {Object} auth
   * @param {Object} options
   * @param {Object} data
   */
  constructor(auth, options, data) {
    this.$auth = auth;
    this.api = new PoetsApi(this.$auth.ctx.$axios);
    this.name = options._name;
    this.options = options;
  }

  /**
   * Return the scope from the options
   */
  get _scope() {
    return Array.isArray(this.options.scope)
      ? this.options.scope.join(" ")
      : this.options.scope;
  }

  /**
   * Make sure we set the axios token when we can
   */
  async mounted() {
    // Sync token and user if applicable
    const token = this.$auth.syncToken(this.name);
    const user = this.$auth.$storage.syncUniversal("user", {}, true);
    // Set axios token
    if (token) {
      this._setToken(token);
    }
    // Set the user with the full data model
    if (validateFetchable(user, this.$auth.ctx.env)) {
      // Add a nice wrapper to help us with stuff
      this.$auth.$user = new PoetsUser(user.id, this.api, user);
      this.$auth.setUser(this.$auth.$user.getUser());
      // Fetch additional metadata
      // @TODO: do we want to fetch additional metdata?
      this.$auth.fetchUser().then(user => {
        this.$auth.$user.setMeta(user);
        this.$auth.$user.getAnthologies().then(() => {
          this.$auth.setUser(this.$auth.$user.getUser());
        });
      });
    }
    // If we cant fetch a user then lets clean the slate
    else {
      this.$auth.logout();
    }
  }

  /**
   * Set the token since axios for all requests
   *
   * @param {String} token
   */
  _setToken(token) {
    // Set Authorization token for all axios requests
    this.$auth.ctx.app.$axios.setHeader("Authorization", token);
  }

  /**
   * Set the token
   *
   * @param {String} token
   */
  _clearToken() {
    // Clear Authorization token for all axios requests
    this.$auth.ctx.app.$axios.setHeader("Authorization", false);
  }

  /**
   * Logout of the drupals and the nuxts
   */
  async logout() {
    this._clearToken();
    this.$auth.$storage.setUniversal("user", Boolean(false));
    this.$auth.$storage.setUniversal("loggedIn", Boolean(false));
    return this.$auth.reset();
  }

  /**
   * Accept the Drupal stuff and login
   * @param {String} raw
   */
  async login(raw) {
    // Let's validate the data
    const auth = base64decode(raw.data);
    // Redirect to home if validation fails
    if (!validateAuth(auth)) {
      return;
    }

    // Get our things
    const destination = !_.isNil(auth.destination) ? auth.destination : "home";
    const token = buildToken(auth.access_token, auth.token_type);

    // Note: The primary reason for using the state parameter is to mitigate CSRF attacks.
    // @see: https://auth0.com/docs/protocols/oauth2/oauth-state
    this.$auth.$storage.setLocalStorage(
      this.name + ".state",
      _.random(7, 47000)
    );
    // Set the user, we need to augment this in fetch user
    this.$auth.setUser({ id: auth.user, destination });
    // Store token
    this.$auth.setToken(this.name, token);
    // Set axios token
    this._setToken(token);
    // Store refresh token if we can
    if (auth.refresh_token && auth.refresh_token.length) {
      this.$auth.setRefreshToken(
        this.name,
        buildToken(auth.refresh_token, auth.token_type)
      );
    }
    // Redirect to destination parameter
    return true;
  }

  /**
   * Get the user profile data from Drupal
   */
  async fetchUser() {
    // @TODO: Try to get some universal storage first?
    // Validate that we have a token\
    if (!this.$auth.getToken(this.name)) {
      return;
    }
    // Validate that we can fetch data
    if (!validateFetchable(this.$auth.user, this.$auth.ctx.env)) {
      return;
    }

    // Get the user data
    const raw = await this.api.getUser(this.$auth.user.id);
    const destination = this.$auth.user.destination;

    // Validate the user data
    if (
      !_.has(raw, "data.data.id") ||
      !_.has(raw, "data.data.attributes.name")
    ) {
      return;
    }

    // Mege things together and get dat user
    const user = _.merge({}, raw.data.data.attributes, {
      id: raw.data.data.id,
      destination
    });
    // Persist "core" user data for performance reasons, on a page load we will
    // lazy load the rest of the properties
    // NOTE: this should be the set of properties we need to be able to
    // 1. render a page quickly with "profile" info, eg a picture or name
    // 2. handle any biz/controller logic without having to make an http request first
    const corePropz = _.pick(user, [
      "destination",
      "drupal_internal__uid",
      "field_first_name",
      "field_last_name",
      "field_membership_status",
      "id",
      "langcode",
      "mail",
      "name",
      "timezone"
    ]);
    this.$auth.$storage.setUniversal("user", corePropz, true);
    this.$auth.$storage.setUniversal("loggedIn", Boolean(user));

    // Generate the new user object and set it universally
    return user;
  }
}

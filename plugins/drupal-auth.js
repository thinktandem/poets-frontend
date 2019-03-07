import { has, isNil, isObject, forEach, merge, random } from "lodash";

/*
 * Helper to build token
 */
const buildToken = (token, type = 'Bearer') => type + ' ' + token;

/*
 * Helper to parse header
 */
const parseHeader = data => {
  try {
    return JSON.parse(new Buffer(data, "base64").toString());
  }
  catch(error) {
    return undefined;
  }
}

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
  _.forEach(['access_token', 'expires_in', 'token_type', 'user'], key => {
    if (!has(auth, key) || isNil(auth[key])) {
      return false;
    }
  });

  // I guess we are good!
  return true;
}

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
    // Sync token
    const token = this.$auth.syncToken(this.name);
    // Set axios token
    if (token) {
      this._setToken(token);
    }
    // Get user
    console.log(this.$auth);
    console.log(token);
  }

  /**
   * Set the token since axios for all requests
   *
   * @param {String} token
   */
  _setToken(token) {
    // Set Authorization token for all axios requests
    this.$auth.ctx.app.$axios.setHeader(this.options.tokenName, token);
  }

  /**
   * Set the token
   *
   * @param {String} token
   */
  _clearToken() {
    // Clear Authorization token for all axios requests
    this.$auth.ctx.app.$axios.setHeader(this.options.tokenName, false);
  }

  /**
   * Logout of the drupals and the nuxts
   */
  async logout() {
    this._clearToken();
    return this.$auth.reset();
  }

  /**
   * Accept the Drupal stuff and login
   */
  async login(raw) {
    // Let's validate the data
    const auth = parseHeader(raw.data);
    // Redirect to home if validation fails
    if (!validateAuth(auth)) {
      return;
    }

    // Get our things
    const destination = (!isNil(auth.destination)) ? auth.destination : 'home';
    const token = buildToken(auth.access_token, auth.token_type);

    // Note: The primary reason for using the state parameter is to mitigate CSRF attacks.
    // @see: https://auth0.com/docs/protocols/oauth2/oauth-state
    this.$auth.$storage.setLocalStorage(this.name + '.state', random(7, 47000));
    // Set the user, we need to augment this in fetch user
    this.$auth.setUser({ id: auth.user, destination: destination });
    // Store token
    this.$auth.setToken(this.name, token);
    // Set axios token
    this._setToken(token);
    // Store refresh token if we can
    if (auth.refresh_token && auth.refresh_token.length) {
      this.$auth.setRefreshToken(this.name, buildToken(auth.refresh_token, auth.token_type));
    }
    // Redirect to destination parameter
    return true;
  }

  /**
   * Get the user profile data from Drupal
   */
  async fetchUser() {
    // Validate that we have a token\
    if (!this.$auth.getToken(this.name)) {
      return;
    }
    // Validate that we have a UUID
    if (!has(this.$auth.$state, 'user.id') || !has(this.$auth.$state, 'user.destination')) {
      return;
    }

    // Get the user data
    const userURL = process.env.baseURL + '/api/user/user/' + this.$auth.$state.user.id;
    const raw = await this.$auth.requestWith(this.name, { url: userURL });
    const destination = this.$auth.$state.user.destination;

    // Validate the user data
    if (!has(raw, 'data.id') || !has(raw, 'data.attributes.name')) {
      return;
    }

    // Generate the new user object and set it universally
    const user = merge({}, raw.data.attributes, { id: raw.data.id, destination });
    this.$auth.setUser(user);
    this.$auth.$storage.setUniversal('user', user);
    this.$auth.$storage.setUniversal('loggedIn', Boolean(user));
    return user.destination;
  }
}

/*
  async _handleCallback(uri) {
    // Callback flow is not supported in server side
    if (process.server) {
      return
    }

    // Parse query from both search and hash fragments
    const hash = parseQuery(window.location.hash.substr(1))
    const search = parseQuery(window.location.search.substr(1))
    const parsedQuery = Object.assign({}, search, hash)

    // accessToken/idToken
    let token = parsedQuery[this.options.token_key || 'access_token']

    // refresh token
    let refreshToken = parsedQuery[this.options.refresh_token_key || 'refresh_token']

    // -- Authorization Code Grant --
    if (this.options.response_type === 'code' && parsedQuery.code) {
      const data = await this.$auth.request({
        method: 'post',
        url: this.options.access_token_endpoint,
        baseURL: false,
        data: encodeQuery({
          code: parsedQuery.code,
          client_id: this.options.client_id,
          redirect_uri: this._redirectURI,
          response_type: this.options.response_type,
          audience: this.options.audience,
          grant_type: this.options.grant_type
        })
      })

      if (data.access_token) {
        token = data.access_token
      }

      if (data.refresh_token) {
        refreshToken = data.refresh_token
      }
    }

    if (!token || !token.length) {
      return
    }

    // Validate state
    const state = this.$auth.$storage.getLocalStorage(this.name + '.state')
    this.$auth.$storage.setLocalStorage(this.name + '.state', null)
    if (state && parsedQuery.state !== state) {
      return
    }

    // Append token_type
    if (this.options.token_type) {
      token = this.options.token_type + ' ' + token
    }

    // Store token
    this.$auth.setToken(this.name, token)

    // Set axios token
    this._setToken(token)

    // Store refresh token
    if (refreshToken && refreshToken.length) {
      refreshToken = this.options.token_type + ' ' + refreshToken
      this.$auth.setRefreshToken(this.name, refreshToken)
    }

    // Redirect to home
    this.$auth.redirect('home', true)

    return true // True means a redirect happened
  }
*/

const DEFAULTS = {
  token_type: "Bearer",
  response_type: "token",
  tokenName: "Authorization"
};

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
    this.options = Object.assign({}, DEFAULTS, options);
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
    console.log("MOUNTED");
    // Sync token
    const token = this.$auth.syncToken(this.name);
    // Set axios token
    if (token) {
      this._setToken(token);
    }

    // Handle callbacks on page load
    // const redirected = await this._handleCallback();

    // if (!redirected) {
    //   return this.$auth.fetchUserOnce();
    // }
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
  async login(data) {
    console.log("login");
  }

  /**
   * Get the user profile data from Drupal
   */
  async fetchUser() {
    if (!this.$auth.getToken(this.name)) {
      return;
    }

    if (!this.options.userinfo_endpoint) {
      this.$auth.setUser({});
      return;
    }

    const user = await this.$auth.requestWith(this.name, {
      url: this.options.userinfo_endpoint
    });

    this.$auth.setUser(user);
  }
}

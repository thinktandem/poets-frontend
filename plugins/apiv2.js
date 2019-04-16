import PoetsApi from "~/plugins/poets-apiv2";

export default ({ app }, inject) => {
  /**
   * Inject the API class
   */
  inject("api", new PoetsApi(app.$axios));
};

import _ from "lodash";
export default ({ app, redirect }, inject) => {
  app.handleError = error => {
    switch (_.get(error, "response.status")) {
      case 403:
        redirect([307], "/403");
        break;
      case 404:
        redirect([307], "/404");
      default:
        redirect("/sorry");
    }
  };
};

<script>
import { get } from "lodash";

export default {
  async asyncData({ app, router, params, redirect }) {
    return app.$axios
      .$get(`/router/translate-path?path=/node/${params.id}`)
      .catch(err => {
        app.handleError(err);
      })
      .then(res =>
        app.$axios
          .$get(
            `/api/${get(res, "entity.type")}/${get(res, "entity.bundle")}/${get(
              res,
              "entity.uuid"
            )}`
          )
          .then(res => {
            return redirect(get(res, "data.attributes.path.alias"));
          })
          .catch(err => app.handleError(err))
      );
  }
};
</script>

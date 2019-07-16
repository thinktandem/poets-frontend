<script>
import { get } from "lodash";

export default {
  async asyncData({ app, router, params, redirect, error }) {
    return app.$axios
      .$get(`/router/translate-path?path=/node/${params.id}`)
      .catch(err => {
        error({ statusCode: 404, message: "" });
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
            return redirect([301], get(res, "data.attributes.path.alias"));
          })
          .catch(err => error({ statusCode: 404, message: "" }))
      );
  }
};
</script>

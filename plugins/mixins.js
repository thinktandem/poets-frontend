import { isEmpty } from "lodash";
import imgUrl from "~/plugins/inlineImagesUrl.js";
import Vue from "vue";

Vue.mixin({
  methods: {
    empty(field) {
      return isEmpty(field) || field === null || field === undefined;
    },
    replaceFileUrl(text) {
      return imgUrl.staticUrl(text);
    }
  }
});

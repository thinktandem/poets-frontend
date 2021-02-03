<template>
  <section class="bg-white py-5 poet__works">
    <b-container>
      <b-row>
        <b-col>
          <b-tabs fill>
            <b-tab
              :title="tab.title.toLowerCase()"
              v-for="(tab, index) in tabs"
              :key="index"
              :active="index === 0">
              <app-listing
                wrapper="div"
                :default-params="tab.defaultParams"
                :includes="{}"
                :fields="fields"
                :resource-type="tab.resourceType"/>
            </b-tab>
            <b-tab
              class="p-4"
              v-if="bibliography"
              title="bibliography">
              <div v-html="bibliography" />
            </b-tab>
          </b-tabs>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import AppListing from "~/components/AppListing";
import _ from "lodash";
export default {
  name: "AppPoetWorks",
  components: { AppListing },
  props: {
    poet: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    bibliography() {
      return _.get(this.poet, "attributes.field_bibliography.processed", null);
    }
  },
  data() {
    return {
      fields: {
        field_date_published: {
          label: "Year"
        },
        title: { label: "Title" }
      },
      tabs: [
        {
          title: "Poems",
          fields: ["year", "title"],
          resourceType: "poems",
          defaultParams: {
            filter: {
              status: 1,
              "field_author.id": _.get(this.poet, "id")
            }
          }
        },
        {
          title: "Texts by",
          fields: ["year", "title"],
          resourceType: "texts",
          defaultParams: {
            filter: {
              status: 1,
              subject: {
                path: "field_contributors.id",
                value: _.get(this.poet, "id"),
                operator: "IN"
              }
            }
          }
        },
        {
          title: "Texts about",
          fields: ["year", "title"],
          resourceType: "texts",
          defaultParams: {
            filter: {
              status: 1,
              subject: {
                path: "field_poets_as_subject.id",
                value: _.get(this.poet, "id"),
                operator: "IN"
              }
            }
          }
        }
      ]
    };
  }
};
</script>

<style >
.poet__works .nav-tabs {
  justify-content: space-evenly;
}
</style>

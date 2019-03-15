<template>
  <b-container>
    <b-row class="filters-row">
      <b-col md="12">
        <b-form
          class="search"
          @submit.stop.prevent="refreshQuery"
        >
          <b-form-group>
            <div
              class="legend-selects"
              v-if="filters.length >= 1">
              <div class="filters__legend">
                <legend>Filter by</legend>
              </div>
              <b-form-select
                v-for="(filter, index) in filters"
                :key="index"
                inline
                v-model="activeFilters[filter.id]"
              >
                <option :value="null">{{ filter.name }}</option>
                <option
                  v-for="(option, index) in filter.options"
                  :key="index"
                  :value="option.value"
                >{{ option.label }}</option>
              </b-form-select>
            </div>
            <div
              class="input--search"
              v-if="searchable.length >= 1">
              <b-input-group>
                <b-form-input
                  v-model="searchText"
                  type="text"
                  size="22"
                  :placeholder="`Search ${searchableLabels} ...`"
                />
                <b-input-group-append
                  is-text
                  @click.stop.prevent="refreshQuery"
                >
                  <magnifying-glass-icon
                    class="icon mr-2"/>
                </b-input-group-append>
              </b-input-group>
            </div>
          </b-form-group>
        </b-form>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="12">
        <b-table
          :class="{ selectable: !hasDetails }"
          :hover="!hasDetails"
          :items="results"
          :sort-by="sort"
          :fields="fullFields"
          :stacked="stacked"
          :per-page="pageLimit"
          :current-page="currentPage"
          @row-clicked="rowClicked">
          <template
            slot="title"
            slot-scope="data">
            <b-link
              v-if="hasDetails"
              :to="data.item.path.alias">{{ data.item.title }}</b-link>
            <span v-else>{{ data.item.title }}</span>
          </template>
          <template
            slot="field_location"
            slot-scope="data">
            <span v-if="data.item.field_location">{{ data.item.field_location.locality }},&nbsp;</span>
            <span v-if="data.item.field_location">{{ data.item.field_location.administrative_area }}</span>
          </template>
          <template
            slot="show_details"
            slot-scope="row">
            <a @click="row.toggleDetails">
              <plus-icon
                size="sm"
                class="expand-icon"/>
            </a>
          </template>

          <template
            slot="row-details"
            slot-scope="row">
            <b-row class="row-details">
              <b-col lg="8">
                <div
                  v-if="row.item.body"
                  v-html="row.item.body.processed"/>
              </b-col>
              <b-col
                class="text-right"
                lg="3"
                lg-offset="1">
                <strong
                  v-if="row.item.event_start_time">{{ row.item.event_start_time
                  }}<br></strong>
                <address
                  v-if="row.item.field_location"
                  class="event__field-body">
                  <strong v-if="row.item.field_location.organization">{{
                  row.item.field_location.organization }}<br></strong>
                  <span v-if="row.item.field_location.address_line1">{{ row.item.field_location.address_line1 }}<br></span>
                  <span v-if="row.item.field_location.address_line2">{{ row.item.field_location.address_line2 }}<br></span>
                  <span v-if="row.item.field_location.locality">{{ row.item.field_location.locality }},&nbsp;</span>
                  <span v-if="row.item.field_location.administrative_area">{{ row.item.field_location.administrative_area }}</span>&nbsp;
                  <span v-if="row.item.field_location.postal_code">{{ row.item.field_location.postal_code }}</span><br>
                </address>
                <b-button
                  v-if="row.item.register_link"
                  variant="primary-dark"
                  size="lg"
                  :href="row.item.register_link.uri"
                >{{ row.item.register_link.title }}</b-button>
                <div class="share-list py-5">
                  <strong>share this event</strong>
                  <poem-actions
                    minimal
                    :poem="{title: row.item.title, alias:
                    row.item.path.alias }"
                  />
                </div>
              </b-col>
            </b-row>
          </template>
        </b-table>
        <b-pagination
          align="center"
          :total-rows="resultTotal"
          :per-page="pageLimit"
          :hide-goto-end-buttons="true"
          @change="fetchNext"
          v-model="currentPage">
          <span slot="prev-text"><IconMediaSkipBackwards/> Prev</span>
          <span slot="next-text">Next <IconMediaSkipForwards/></span>
        </b-pagination>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import _ from "lodash";
import IconMediaSkipBackwards from "~/static/icons/media-skip-backwards.svg";
import IconMediaSkipForwards from "~/static/icons/media-skip-forwards.svg";
import MagnifyingGlassIcon from "~/node_modules/open-iconic/svg/magnifying-glass.svg";
import PlusIcon from "~/node_modules/open-iconic/svg/plus.svg";
import PoemActions from "~/components/PoemActions";
export default {
  name: "AppListing",
  components: {
    IconMediaSkipBackwards,
    IconMediaSkipForwards,
    MagnifyingGlassIcon,
    PlusIcon,
    PoemActions
  },
  props: {
    resourceType: {
      type: String,
      default: "poems"
    },
    details: {
      type: Object,
      default: () => {}
    },
    pageLimit: {
      type: Number,
      default: 10
    },
    sort: {
      type: String,
      default: "Name"
    },
    defaultParams: {
      type: Object,
      default: () => ({})
    },
    includes: {
      type: Object,
      default: () => ({ field_author: "title" })
    },
    fields: {
      type: Object,
      default: () => {
        return {
          title: { label: "Name" },
          field_author: { label: "Author" },
          field_date_published: { label: "Date" }
        };
      }
    },
    filters: {
      type: Array,
      default: () => []
    },
    searchable: {
      type: Array,
      default: () => []
    },
    stacked: {
      type: String,
      default: "sm"
    },
    perPage: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      results: [],
      currentPage: 1,
      rawResponse: {},
      resultTotal: 0,
      activeFilters: [],
      searchText: ""
    };
  },
  mounted() {
    // Set the possible filters based on the incoming filter list
    this.activeFilters = _.reduce(
      this.filters,
      (result, filter) => {
        result[filter.id] = null;
        return result;
      },
      {}
    );
    // Perform the inital query to populate the listing
    this.refreshQuery();
  },
  computed: {
    searchableLabels() {
      return _.map(this.searchable, field => field.label).join(", ");
    },
    fieldsToFetch() {
      return _.merge(this.fields, this.details);
    },
    fullFields() {
      return this.hasDetails
        ? _.merge(this.fields, { show_details: { label: "" } })
        : this.fields;
    },
    searchFilters() {
      const searchText = this.searchText;
      return searchText.length >= 1
        ? {
            filter: _.merge(
              { searchGroup: { group: { conjunction: "OR" } } },
              _.reduce(
                _.map(this.searchable, field => field.field),
                (result, field, key, searchable) => {
                  if (searchText.length >= 1) {
                    result[field] = {
                      condition: {
                        path: field,
                        value: searchText,
                        operator: "CONTAINS",
                        memberOf: "searchGroup"
                      }
                    };
                  }
                  return result;
                },
                {}
              )
            )
          }
        : {};
    },
    query() {
      let fields = {};
      fields[`node--${this.resourceType}`] = Object.keys(
        // Always include the path for linking.
        _.merge({ path: null }, this.fields, this.details)
      ).join(",");

      return _.merge(
        {},
        // If we have any searchable fields and search text, query those fields
        this.searchFilters,
        // Some defaults
        {
          include: Object.keys(this.includes).join(","),
          fields: fields,
          filter: {
            status: 1
          },
          page: {
            limit: this.pageLimit * 3
          }
        },
        // Param overrides from props
        this.defaultParams
      );
    },
    hasDetails() {
      return !_.isEmpty(this.details);
    },
    hasNext() {
      return _.get(this.rawResponse, "links.next") !== undefined;
    }
  },
  methods: {
    formatResults(response) {
      return _.map(response.data, row => {
        return _.merge(
          row.attributes,
          // Merge in the included items in the result set.
          _(this.includes)
            .mapValues((value, key, collection) =>
              _.get(this.$getRelated(res, row, key), `attributes.${value}`)
            )
            .value()
        );
      });
    },
    async fetchNext(newPage) {
      return this.hasNext && newPage > this.currentPage
        ? this.$axios
            .$get(_.get(this.rawResponse, "links.next.href"))
            .then(response => {
              this.rawResponse = response;
              this.results = this.results.concat(this.formatResults(response));
            })
        : null;
    },
    async refreshQuery() {
      this.$axios
        .$get(`/api/node/${this.resourceType}?`, {
          params: this.query
        })
        .then(response => {
          this.rawResponse = response;
          this.results = this.formatResults(response);
          this.resultTotal = parseInt(_.get(response, "meta.count", 0));
        });
    },
    rowClicked(items) {
      return !this.hasDetails
        ? this.$router.push(_.get(items, "path.alias"))
        : null;
    }
  }
};
</script>
<style lang="scss">
thead {
  th {
    background-color: $gray-200;
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
  }
}
.selectable td {
  cursor: pointer;
}
.list {
  padding-top: 3rem;
  padding-bottom: 3rem;
}
.search {
  margin-top: 2rem;
}
.link {
  font-weight: 560;
}
.legend-selects {
  display: flex;
  flex-basis: 100%;
  padding: 1rem 1rem 1rem 2rem;
  border-right: $form__border;
  select {
    &:not(:last-child) {
      margin-right: 1rem;
    }
  }
}
.filters__legend {
  flex-basis: 50%;
  legend {
    margin: 0;
    line-height: 2;
    font-size: $font-size-base;
    color: $gray-700;
  }
}
.input--search {
  flex-basis: 100%;
  padding: 1rem;
  position: relative;
  input {
    border: none;
    background-color: transparent;
    &:hover,
    &:focus,
    &:active {
      border: none;
      background-color: transparent;
    }
    &::placeholder {
      color: $gray-700;
    }
  }
  button {
    width: 2rem;
    height: 2rem;
    display: flex;
    padding: 0;
    justify-content: center;
    position: absolute;
    top: 50%;
    right: 1rem;
    transform: translateY(-50%);
    background-color: transparent;
    border: none;
    &:hover,
    &:focus,
    &:active,
    &:active:focus {
      // Some really sticky rules getting applied from BS that need a bit of
      // force.
      background-color: transparent !important;
      box-shadow: none !important;
    }
    svg {
      width: 100%;
      height: 100%;
    }
  }
}
.icon {
  display: inline;
  fill: $blue;
  width: 1.4rem;
  height: 1.4rem;
}
.input-group-text {
  background: transparent;
  border: none;
}
.expand-icon {
  color: $blue-dark;
  height: 20px;
  width: 20px;
  fill: $blue-dark;
  cursor: pointer;
  transition: transform 0.1s;
}
.b-table-has-details .expand-icon {
  fill: $blue-lightest;
  transform: rotate(45deg);
}
.row-details {
  font-weight: 400;
  color: $indigo;
}
.share-list {
  strong {
    font-size: 0.9rem;
  }
}
.poem__actions ul {
  justify-content: flex-end;
}
</style>

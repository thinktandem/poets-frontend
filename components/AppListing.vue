<template>
  <b-container v-show="showList">
    <component
      class="py-3"
      :is="titleTag"
      v-show="!empty(title)">{{ title }} </component>
    <b-row
      v-if="searchable.length >= 1 || filters.length >=1"
      class="filters-row"
    >
      <b-col md="12">
        <app-form @submit="refreshQuery">
          <b-form-group :class="['table-filters', {'table-filters--search-only': filters.length < 1}]">
            <template v-if="filters.length >= 1">
              <div>
                <legend>Filter by</legend>
              </div>
              <b-form-select
                :disabled="busy"
                v-for="(filter, index) in filters"
                :key="index"
                inline
                :options="filter.options"
                v-model="activeFilters[filter.id]"
                @change="refreshQuery"
              >
                <template slot="first">
                  <option
                    :value="null"
                    disabled
                  >
                    {{ filter.name }}</option>
                </template>
              </b-form-select>
            </template>
            <div
              class="table-filters__search"
              v-if="searchable.length >= 1"
            >
              <b-input-group>
                <b-form-input
                  :disabled="busy"
                  v-model="searchText"
                  type="text"
                  size="22"
                  :placeholder="`Search ${searchableLabels} ...`"
                />
                <b-input-group-append class="icon--search">
                  <b-btn
                    :disabled="busy"
                    type="button"
                    @click="refreshQuery"
                    variant="transparent"
                  >
                    <magnifying-glass-icon class="icon" />
                  </b-btn>
                </b-input-group-append>
              </b-input-group>
            </div>
          </b-form-group>
        </app-form>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="12">
        <b-table
          v-show="!empty(results)"
          :class="[{ selectable: !hasDetails, 'has-details': hasDetails }]"
          :items="results"
          :sort-by="sort"
          :fields="fullFields"
          :stacked="stacked"
          :per-page="pageLimit"
          :current-page="currentPage"
        >
          <template
            slot="field_date_published"
            slot-scope="data">{{ year(data.item.field_date_published) }}</template>
          <template
            v-if="resourceType === 'teach_this_poem'"
            slot="body"
            slot-scope="data"
          >
            <div
              v-if="data.item.body.summary !== null"
              v-html="replaceFileUrl(data.item.body.summary)"
            />
            <div
              v-else
              v-html="replaceFileUrl(teaserText(data.item.body.value, 100))"
            />
          </template>
          <template
            slot="field_event_date"
            slot-scope="data"
          ><span>{{ shortDate(data.item.field_event_date) }}</span></template>
          <template
            slot="created"
            slot-scope="data"
          ><span>{{ shortDate(data.item.created) }}</span>
          </template>
          <template
            slot="title"
            slot-scope="data"
          >
            <b-link
              :to="data.item.path.alias"
            >{{ data.item.title }}</b-link>
          </template>
          <template
            slot="field_contributors"
            slot-scope="data"
          >
            {{ data.item.field_contributors }}
          </template>
          <template
            slot="field_location"
            slot-scope="data"
          >
            <span v-if="data.item.field_location">{{ data.item.field_location.locality }},&nbsp;</span>
            <span v-if="data.item.field_location">{{ data.item.field_location.administrative_area }}</span>
          </template>
          <template
            slot="show_details"
            slot-scope="row"
          >
            <a @click="row.toggleDetails">
              <plus-icon
                size="sm"
                class="expand-icon"
              />
            </a>
          </template>

          <template
            slot="row-details"
            slot-scope="row"
          >
            <b-row class="row-details">
              <b-col lg="8">
                <div
                  v-if="row.item.body"
                  v-html="replaceFileUrl(row.item.body.processed)"
                />
              </b-col>
              <b-col
                class="text-right"
                lg="3"
                lg-offset="1"
              >
                <strong v-if="row.item.event_start_time">{{ row.item.event_start_time
                }}<br></strong>
                <address
                  v-if="row.item.field_location"
                  class="event__field-body"
                >
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
                  target="_blank"
                  class="external"
                  variant="primary-dark"
                  size="lg"
                  :href="row.item.register_link.uri"
                >{{ row.item.register_link.title }}</b-button>
                <div
                  v-show="resourceType === 'events'"
                  class="share-list py-5"
                >
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
        <div class="pager">
          <b-pagination
            :disabled="busy"
            v-if="paged"
            v-show="!empty(results)"
            @change="fetchNext"
            hide-goto-end-buttons
            :per-page="pageLimit"
            size="lg"
            :total-rows="resultTotal"
            v-model="currentPage"
            align="fill"
          >
            <span slot="prev-text">
              <iconMediaSkipBackwards /> Prev
            </span>
            <span slot="next-text">
              Next
              <iconMediaSkipForwards />
            </span>
          </b-pagination>
        </div>
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
import moment from "moment";
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
    title: {
      type: String,
      default: ""
    },
    titleTag: {
      type: String,
      default: "h3"
    },
    hideEmpty: {
      type: Boolean,
      default: false
    },
    // Drupal content type we're fetching.
    resourceType: {
      type: String,
      default: "poems"
    },
    // Expandable list item; specify fields that will show up. @todo: genericize
    // for more content types and situations.
    details: {
      type: Object,
      default: () => {}
    },
    // Limit the pager.
    pageLimit: {
      type: Number,
      default: 10
    },
    // Allow sorting on a field.
    sort: {
      type: String,
      default: "Name"
    },
    // Default params, for example, filtering results by a specific field.
    defaultParams: {
      type: Object,
      default: () => ({})
    },
    includes: {
      type: Object,
      default: () => ({ field_author: "title" })
    },
    // Fields define the data displayed, aka the columns of the list table.
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
    // What fields should be searchable. Leave blank for no search.
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
    },
    paged: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      busy: true,
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
    // Spin up a debouncing func for text input
    this.debouncedRefreshQuery = _.debounce(this.refreshQuery, 700);
  },
  watch: {
    searchText: function() {
      this.debouncedRefreshQuery();
    }
  },
  computed: {
    showList() {
      return !this.empty(this.results) || this.showEmpty === true;
    },
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
      fields[`node--${this.resourceType}`] = _(
        _.merge({ path: null }, this.fields, this.details)
      )
        .keys()
        .pickBy()
        .map(field => {
          return _.first(field.split("."));
        })
        .join(",");

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
          },
          sort: "-created"
        },
        // Param overrides from props
        this.defaultParams,
        {
          filter: _.pickBy(this.activeFilters)
        }
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
    shortDate(date) {
      return moment(date).format("M/D/YYYY");
    },
    year(date) {
      return moment(date).format("YYYY");
    },
    teaserText(text, len) {
      const truncText = _.truncate(text, {
        length: len,
        separator: " "
      });

      return truncText;
    },
    formatResults(response) {
      return _.map(response.data, row => {
        return _.merge(
          row.attributes,
          // Merge in the included items in the result set.
          _(this.includes)
            .mapValues((value, key, collection) =>
              _.get(this.$getRelated(response, row, key), `attributes.${value}`)
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
      this.busy = true;
      this.$axios
        .$get(`/api/node/${this.resourceType}?`, {
          params: this.query
        })
        .then(response => {
          this.rawResponse = response;
          this.results = this.formatResults(response);
          this.resultTotal = parseInt(_.get(response, "meta.count", 0));
          this.busy = false;
        });
    }
  }
};
</script>
<style lang="scss">
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

.table-filters {
  .table-filters__search {
    @include media-breakpoint-up(sm) {
      min-width: 26rem;
    }
  }
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

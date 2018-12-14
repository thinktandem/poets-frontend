<template>
  <section class="filter-table">
    <div class="filters">
      <b-form-group
        horizontal
        label="Filter"
      >
        <b-input-group>
          <b-form-input
            v-model="filter"
            placeholder="Type to Search"
            blah="blah"
          />
          <b-input-group-append>
            <b-btn
              :disabled="!filter"
              @click="filter = ''"
            >Clear</b-btn>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>
      <b-form-group
        horizontal
        label="Sort"
      >
        <b-input-group>
          <b-form-select
            v-model="sortBy"
            :options="sortOptions"
          >
            <option
              slot="first"
              :value="null"
            >-- none --</option>
          </b-form-select>
          <b-form-select
            :disabled="!sortBy"
            v-model="sortDesc"
            slot="append"
          >
            <option :value="false">Asc</option>
            <option :value="true">Desc</option>
          </b-form-select>
        </b-input-group>
      </b-form-group>
      <b-form-group
        horizontal
        label="Sort direction"
      >
        <b-input-group>
          <b-form-select
            v-model="sortDirection"
            slot="append"
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
            <option value="last">Last</option>
          </b-form-select>
        </b-input-group>
      </b-form-group>
      <b-form-group
        horizontal
        label="Per page"
      >
        <b-form-select
          :options="pageOptions"
          v-model="perPage"
        />
      </b-form-group>
    </div>

    <!-- Main table element -->
    <b-table
      show-empty
      stacked="md"
      :items="items"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      :filter="filter"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
      @filtered="onFiltered"
    >
      <template
        slot="name"
        slot-scope="row"
      >{{ row.value.first }} {{ row.value.last }}</template>
      <template
        slot="years"
        slot-scope="row"
      >{{ row.value?'Yes :)':'No :(' }}</template>
      <template
        slot="row-details"
        slot-scope="row"
      >
        <b-card>
          <ul>
            <li
              v-for="(value, key) in row.item"
              :key="key"
            >{{ key }}: {{ value }}</li>
          </ul>
        </b-card>
      </template>
    </b-table>

    <Pager
      :total-rows="totalRows"
      :per-page="perPage"
    />
  </section>
</template>

<script>
import Pager from "~/components/Pager";

export default {
  components: {
    Pager
  },

  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      fields: [
        {
          key: "name",
          label: "Person Full name",
          sortable: true,
          sortDirection: "desc"
        },
        {
          key: "years",
          label: "Years",
          sortable: true,
          class: "text-center"
        },
        { key: "schoolsMovements", label: "Schools & Movements" }
      ],
      currentPage: 1,
      perPage: 5,
      totalRows: this.items.length,
      pageOptions: [5, 10, 15],
      sortBy: null,
      sortDesc: false,
      sortDirection: "asc",
      filter: null
    };
  },
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields.filter(f => f.sortable).map(f => {
        return { text: f.label, value: f.key };
      });
    }
  },
  methods: {
    onFiltered(filteredItems) {
      // Trigger pagination to ufpdate the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    }
  }
};
</script>

<style lang="scss">
.filter-table {
  .table {
    td,
    th {
      padding: 1rem 2rem;
      border-bottom: 1px solid $table__border__color;

      &:last-child {
        text-align: right;
      }
    }

    th {
      border-top: none;
    }

    td {
      font-weight: 400;
    }

    tbody {
      tr {
        td {
          padding: 1rem 2rem;
        }
      }
    }
  }
}
</style>

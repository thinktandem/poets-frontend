<template>
  <b-container class="dashboard-wrapper">
    <h1>Dashboard</h1>
    <b-card
      class="shadow-lg"
      title="user information"
      sub-title="Information about my poets account">
      <b-row>
        <b-col>
          <b-table
            :items="userData"
            thead-class="d-none"/>
        </b-col>
        <b-col cols="1"/>
        <b-col cols="3">
          <b-nav vertical>
            <b-nav-item
              href="https://poets.myshopify.com/"
              target="_blank">
              visit the poets shop
            </b-nav-item>
            <b-nav-item href="mailto:membership@poets.org?subject=Update My Address">update address</b-nav-item>
          </b-nav>
        </b-col>
      </b-row>
    </b-card>

    <b-card
      class="shadow-lg"
      :title="membershipCardData.title"
      :sub-title="membershipCardData.sub">
      <b-row>
        <b-col>
          <b-table
            :items="membershipData"
            thead-class="d-none"/>
        </b-col>
        <b-col cols="1"/>
        <b-col cols="3">
          <b-nav vertical>
            <b-nav-item
              :href="membershipCardData.ctaLink"
              target="_blank">
              {{ membershipCardData.ctaText }}
            </b-nav-item>
          </b-nav>
        </b-col>
      </b-row>
    </b-card>

    <b-card
      class="shadow-lg"
      title="anthologies"
      sub-title="anthologies i've created">
      <b-row>
        <b-col>
          <b-card-group columns>
            <b-card
              v-for="anthology in anthologies"
              border-variant="info"
              :key="anthology.id"
            >
              <b-link
                class="card-title"
                :to="anthology.link">{{ anthology.title }}</b-link>
              <b-list-group
                flush
                class="text-dark">
                <b-list-group-item
                  v-for="poem in anthology.poems"
                  border-variant="info"
                  :key="poem.key">
                  <b-link
                    class="text-dark"
                    :to="poem.path"
                    itemprop="title">
                    {{ poem.title }}
                  </b-link>
                  <b-link
                    :disabled="anthology.busy"
                    v-if="poem.title"
                    @click="removePoem(anthology, poem)"
                    class="text-warning float-right"
                    itemprop="title">
                    remove poem
                  </b-link>
                </b-list-group-item>
              </b-list-group>
              <b-card-body>
                <b-link
                  v-b-modal.confirmAnthologyDelete
                  @click="selectAnthology(anthology)"
                  :disabled="anthology.busy">
                  delete entire anthology
                </b-link>
              </b-card-body>
            </b-card>
          </b-card-group>
        </b-col>
        <b-col cols="3">
          <b-nav vertical>
            <b-nav-item to="home">make an anthology</b-nav-item>
            <b-nav-item to="home">the marianne moore of first intentions</b-nav-item>
            <b-nav-item to="home">watch a blaney lecture</b-nav-item>
            <b-nav-item to="home">make a special gift</b-nav-item>
          </b-nav>
        </b-col>
      </b-row>
    </b-card>

    <b-modal
      centered
      id="confirmAnthologyDelete"
      size="sm"
      cancel-title="No! Get me out of here!"
      cancel-variant="info"
      ok-title="Yes, I am sure"
      ok-variant="danger"
      @ok="deleteAnthology(selectedAnthology)"
      :title="selectedAnthology.title">
      Are you sure you want to delete the anthology <em>{{ selectedAnthology.title }}</em>?
    </b-modal>

  </b-container>
</template>

<script>
import _ from "lodash";
import utils from "~/plugins/auth-utils.js";

// Selected defaults
const selectedAnthologyDefaults = { title: "" };

// Helper to update an anthology's display data
// @NOTE: we do this because we need to trigger a "change" in this.anthologies
// eg its not sufficient to just find an anthology and set it
const updateAnthology = (anthologies, anthology) => {
  const index = _.findIndex(anthologies, { id: anthology.id });
  anthologies.splice(index, 1, anthology);
  return anthologies;
};

// Helper to toggle an anthologies busy status
const setAnthologyBusy = (anthologies, anthology, busy = true) => {
  return updateAnthology(anthologies, _.merge({}, anthology, { busy }));
};

export default {
  middleware: "auth",
  layout: "bannerless",
  data() {
    return {
      userData: {},
      membershipData: {},
      anthologies: [],
      selectedAnthology: selectedAnthologyDefaults
    };
  },
  computed: {
    isActiveMember() {
      if (_.has(this.$auth, "user")) {
        return (
          _.get(this.$auth.user.getUser(), "field_membership_status") ===
          "Active"
        );
      } else {
        return false;
      }
    },
    membershipCardData() {
      if (this.isActiveMember) {
        return {
          title: "member information",
          sub: "information about my poets membership",
          ctaText: "renew now",
          ctaLink: "https://www.poets.org"
        };
      } else {
        return {
          title: "donor information",
          sub: "information about my poets donations",
          ctaText: "join now",
          ctaLink: "/membership"
        };
      }
    }
  },
  mounted() {
    if (!this.$auth.loggedIn) {
      this.$router.push("/login");
    }
    // Get basic stuff if we can
    if (_.has(this.$auth, "user")) {
      this.userData = utils.parseUser(this.$auth.user.getUser());
      this.membershipData = utils.parseMembership(this.$auth.user.getUser());
    }
    // Get the other stuff
    Promise.all([
      this.$auth.user.pullUser(),
      this.$auth.user.pullAnthologies()
    ]).then(() => {
      const data = this.$auth.user.getUser();
      // Reset our basic datas
      this.userData = utils.parseUser(data);
      this.membershipData = utils.parseMembership(data, this.isActiveMember);
      // Make a copy of our core anthology data
      this.anthologies = _.cloneDeep(data.anthologies);
      // Get the rest of our poem metdata
      _.forEach(this.anthologies, anthology => {
        anthology.busy = false;
        this.$auth.user.api.getAnthologyPoems(anthology.id).then(response => {
          anthology.poems = utils.parsePoems(_.get(response, "data.data", []));
        });
      });
    });
  },
  methods: {
    deleteAnthology(anthology) {
      setAnthologyBusy(this.anthologies, anthology);
      this.$auth.user.api
        .deleteAnthologies(anthology)
        .then(() => {
          this.selectedAnthology = selectedAnthologyDefaults;
          _.remove(this.anthologies, { id: anthology.id });
        })
        .catch(error => {
          console.error(error);
          this.$toast.error("An error occurred!").goAway(3000);
        });
    },
    selectAnthology(anthology) {
      this.selectedAnthology = anthology;
    },
    removePoem(anthology, poem) {
      setAnthologyBusy(this.anthologies, anthology);
      // Get new list of poem ids without mutating anthology.poems since that
      // would preemptively alter the display
      const newAnthology = _.cloneDeep(anthology);
      newAnthology.poems = _(anthology.poems)
        .filter(data => data.key !== poem.key)
        .map(data => data.id)
        .value();
      // Update the users anthologies
      this.$auth.user.anthologies = updateAnthology(
        this.$auth.user.anthologies,
        newAnthology
      );
      // Push the users updates
      this.$auth.user
        .pushAnthologies([anthology.id])
        .then(() => {
          // @NOTE: we use the key instead of the ID because key is unique and id may not be
          // eg if the user has added the same poem twice
          _.remove(anthology.poems, { key: poem.key });
          this.anthologies = updateAnthology(this.anthologies, anthology);
          setAnthologyBusy(this.anthologies, anthology, false);
        })
        .catch(error => {
          console.error(error);
          this.$toast.error("An error occurred!").goAway(3000);
        });
    }
  }
};
</script>

<style lang="scss">
.dashboard-wrapper {
  margin-top: 3em;
  margin-bottom: 3em;
  td {
    white-space: pre;
  }
  .card {
    margin-bottom: 25px;
  }
  a.disabled {
    opacity: 0.5;
    cursor: default;
  }
  a.disabled:hover {
    text-decoration: none;
    color: #007ab3;
  }
  .list-group-item {
    padding-left: 0;
    border-bottom: 1px;
    font-size: 14px;
    a.disabled:hover {
      color: #ffa02f !important;
    }
  }
  @media (min-width: 576px) {
    .card-columns {
      column-count: 2;
    }
  }
}
</style>

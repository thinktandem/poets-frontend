<template>
  <div>
    <div
      class="daily-poem"
      :class="{summary: (extended !== true)}">
      <b-container class="px-0">
        <div class="daily-poem__header d-flex d-md-none">
          <span class="daily-poem__label p-2 my-auto">
            poem-a-day
          </span>
          <h3
            class="daily-poem__poet-name my-auto px-0"
            v-if="null !== poet.name">
            {{ poet.name }}
          </h3>
          <div class="daily-poem__poet-image">
            <b-img-lazy
              :src="poet.image"
              blank-color="#00B4F0"
            />
          </div>
        </div>
      </b-container>
      <b-container class="daily-poem__poem-container">
        <b-row class="d-none d-md-block py-4">
          <b-col offset-md="3"/>
        </b-row>
        <b-row class="d-flex flex-wrap flex-md-nowrap">
          <b-col
            md="4"
            sm="12"
            tag="aside"
            class="daily-poem__aside px-0 order-2 order-md-1">
            <h3 class="pr-3 d-flex flex-row-reverse">
              <b-link
                :to="poet.alias"
                class="text-white">{{ poet.name }}</b-link>
            </h3>
            <div
              class="daily-poem__poet-image d-md-flex flex-column
              align-items-end d-none">
              <b-link :to="poet.alias">
                <b-img-lazy
                  :src="poet.image"
                  fluid
                  blank-color="#00B4F0"
                />
              </b-link>
            </div>
            <div class="mt-md-5">
              <signup-block
                :show-actions="true"
                :poem="poem"/>
            </div>
            <div
              v-if="extended === true"
              class="daily-poem__about pl-3 pr-4">
              <h3 class="font-serif">About Poem-a-Day</h3>
              <p class="poem-a-day__about-content">
                Poem-a-day is the original and only daily digital poetry series featuring
                over 200 new, previously unpublished poems by today’s talented poets each
                year. On weekdays, poems are accompanied by exclusive commentary by the
                poets. The series highlights classic poems on weekends. Launched in 2006,
                Poem-a-Day is now distributed via email, web, and social media to
                350,000+ readers free of charge and is available for syndication. For more
                information about how to syndicate Poem-a-Day, contact
                <a href="mailto:poem-a-day@poets.org">poem-a-day@poets.org</a>.
              </p>
            </div>
          </b-col>
          <b-col
            sm="12"
            md="8"
            class="daily-poem__poem order-1 order-md-2 d-flex flex-column justify-content-between">
            <div>
              <div>
                <span class="daily-poem__label p-3 d-none d-md-inline">
                  poem-a-day
                </span>
              </div>
              <article
                class="pb-2 mr-3 pr-3">
                <div
                  v-if="poem.about && showAbout"
                  class="p-4 mb-4 border-left border-primary bg-light">
                  <button
                    @click="showAbout = false"
                    type="button"
                    class="close"
                    aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                  <h3>About this Poem</h3>
                  <div
                    class="text-gray"
                    v-html="poem.about"/>
                </div>
                <div
                  class="px-0 mx-0"
                  v-if="showSoundCloud"
                  v-html="poem.soundCloud"/>
                <div class="d-flex pt-3 pb-3 daily-poem__poem-title">
                  <h2><b-link
                    :to="poem.alias"
                    class="text-dark">{{ poem.title }}</b-link></h2>
                  <div class="d-flex col-md-4 col-lg-3 flex-column align-items-center">
                    <b-link
                      @click="showSoundCloud = true"
                      v-if="showSoundCloud === false && null !== poem.soundCloud">
                      <speaker-icon class="daily-poem__soundcloud-link mb-3"/>
                    </b-link>
                    <b-link
                      @click="showSoundCloud = false"
                      v-if="showSoundCloud == true">
                      <span class="daily-poem__soundcloud-link">&#10005;</span>
                    </b-link>
                    <b-link
                      class="border-top"
                      v-if="showAbout == false && null !== poem.about"
                      @click="showAbout = true">about <i class="fancy-chevron"/></b-link>
                  </div>
                </div>
                <div
                  v-html="poem.text"
                  class="daily-poem__poem-text font-serif-2"/>
                <div
                  class="daily-poem__read-the-rest pb-4"
                  v-if="extended === false">
                  <b-btn
                    variant="primary-dark"
                    v-b-modal.poemADayModal>read the rest</b-btn>
                </div>
              </article>
            </div>
            <div
              class="poem-a-day__attribution text-muted-dark p-2"
              v-if="poem.attribution"
              v-html="poem.attribution"/>
          </b-col>
        </b-row>
      </b-container>
      <b-modal
        v-if="extended === false"
        title="poem-a-day"
        size="lg"
        centered
        lazy
        header-class="font-serif"
        header-border-variant="0"
        body-class="font-serif-2"
        footer-bg-variant="black"
        id="poemADayModal">
        <b-container>
          <b-row>
            <b-col sm="12">
              <h5
                class="font-serif h3"
                style="margin-bottom: 0"
                v-html="poem.title"/>
              <b-link
                :to="poet.alias"
                class="pb-4 font-sans text-dark" 
                style="display: block">{{ poet.name }}</b-link>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="12">
              <div v-html="poem.text"/>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="12">
              <b-link
                :to="poet.alias"
                class="pb-3 font-sans text-dark">{{ poet.name }}</b-link>
              <div v-html="poem.text"/>
            </b-col>
          </b-row>
        </b-container>
        <template
          slot="modal-footer"
          class="p-0">
          <signup-block :poem="poem" />
        </template>
      </b-modal>
    </div>
  </div>
</template>

<script>
import SignupBlock from "~/components/SignupBlock";
import SpeakerIcon from "~/node_modules/open-iconic/svg/volume-high.svg";
export default {
  name: "DailyPoem",
  components: {
    SignupBlock,
    SpeakerIcon
  },
  data() {
    return {
      showSoundCloud: false,
      showAbout: false
    };
  },
  props: {
    extended: {
      type: Boolean,
      default: false
    },
    poem: {
      type: Object,
      default() {
        return {
          text: "",
          title: "",
          soundCloud: ""
        };
      }
    },
    poet: {
      type: Object,
      default() {
        return {
          name: "",
          image: "",
          link: ""
        };
      }
    }
  }
};
</script>

<style lang="scss">
.fancy-chevron {
  @include chevron(0.5rem, 3px, 0px, $blue-dark);
}
.daily-poem {
  background: linear-gradient($gray-900), linear-gradient(#c9cacb);
  background-size: auto 38rem, auto;
  background-repeat: no-repeat;
  aside {
    .daily-poem__poet-image {
      display: flex;
      justify-content: flex-end;
    }
  }
  & + section {
    padding-top: $spacer * 10 !important;
  }
}
.summary .daily-poem__poem {
  box-shadow: 0 -3px 0 0 #00b4f0, 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
.summary .daily-poem__poem-text {
  overflow: hidden;
  position: relative;
  max-height: 443px;
  &:after {
    position: absolute;
    bottom: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    content: "";
    overflow: hidden;
    background: linear-gradient(
      transparent 0%,
      transparent 70%,
      rgba(255, 255, 255, 0.8) 80%,
      rgba(255, 255, 255, 1) 90%
    );
    pointer-events: none;
  }
}

.daily-poem__header {
  max-height: 66px;
  justify-content: space-between;
  .daily-poem__poet-image {
    flex-basis: 66px;
    img {
      height: 100%;
    }
  }
  .daily-poem__poet-name {
    color: var(--white);
    // flex-basis: 30%;
    font-size: $font-size-base;
  }
}
.daily-poem__poet-image {
  position: relative;
  &:after {
    display: block;
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    content: "";
    background: linear-gradient(
      0.25turn,
      transparent 0%,
      transparent 50%,
      rgba(0, 0, 0, 1) 100%
    );
    pointer-events: none;
  }
}
.daily-poem__label {
  background-color: var(--blue);
  line-height: 1.25rem;
  font-weight: 600;
}

.daily-poem__poem-container .container {
  margin-left: $spacer;
}
.daily-poem__poem-title {
  flex-direction: column;
  h2 {
    font-family: $font-family-serif;
    font-size: 1.25rem;
    line-height: 2rem;
    font-style: italic;
  }
}
.daily-poem__soundcloud-link {
  float: right;
  color: var(--blue-dark);
  fill: var(--blue-dark);
  font-size: 1.9rem;
  width: 1.9rem;
  height: 1.9rem;
}
.daily-poem__poem {
  box-shadow: 0 3px 0 0 #00b4f0, 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  background-color: var(--white);
}
.summary .daily-poem__poem {
  /*position: absolute;*/
}
.daily-poem__poem-text {
  font-size: $font-size-base;
  font-family: $font-family-serif;
  line-height: 1.5rem;
}
.daily-poem__read-the-rest {
  position: relative;
}

.daily-poem__about {
  h3 {
    font-size: 1.9rem;
    line-height: 1.9rem;
  }
  p {
    font-weight: 400;
  }
  padding-top: 3rem;
}
// sm and up
@include media-breakpoint-up(sm) {
  .daily-poem__poem-container.container {
    margin: auto;
  }
  .daily-poem__header {
    max-height: initial;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .daily-poem__poet-name {
      font-size: $h3-font-size;
      padding: $spacer $spacer;
    }
  }
}
// Md and up
@include media-breakpoint-up(md) {
  .daily-poem__header {
    max-height: initial;
  }
  .daily-poem__label {
    font-size: 1.25rem;
    line-height: 1.56rem;
    position: relative;
    left: -$spacer;
    top: $spacer * 2.5;
  }
  .daily-poem__poet-image {
    height: auto;
    max-width: 100%;
  }

  .daily-poem__read-the-rest {
    padding-top: $spacer * 2;
  }
  .daily-poem__poem-title {
    flex-direction: row;
    justify-content: space-between;
    h2 {
      font-size: $h3-font-size;
    }
  }
  .daily-poem__poem {
    article {
      padding-bottom: $spacer * 2;
      padding-left: $spacer * 9;
    }
  }
  .daily-poem__poem-text {
    font-size: 1.25rem;
    line-height: 1.85rem;
  }
  .poem-a-day__attribution {
    font-weight: 400;
  }
}
</style>

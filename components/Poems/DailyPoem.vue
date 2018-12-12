<template>
  <div class="daily-poem">
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
        <b-col offset-md="3">
          <h3>
            <b-link
              :to="poet.alias"
              class="text-white">{{ poet.name }}</b-link>
          </h3>
        </b-col>
      </b-row>
      <b-row>
        <b-col
          md="4"
          tag="aside"
          class="d-none d-md-block pr-0">
          <div class="daily-poem__poet-image">
            <b-link :to="poet.alias">
              <b-img-lazy
                :src="poet.image"
                fluid
                blank-color="#00B4F0"
              />
            </b-link>
          </div>
          <div class="mt-5">
            <AppPoemADaySignUpForm :poem="poem"/>
          </div>
        </b-col>
        <b-col
          sm="12"
          md="8"
          class="daily-poem__poem">
          <span class="daily-poem__label p-3 d-none d-md-inline">
            poem-a-day
          </span>
          <article
            class="pb-2 mr-3 pr-3">
            <div
              class="px-0 mx-0"
              v-if="showSoundCloud"
              v-html="poem.soundCloud"/>
            <div class="d-flex pt-3 pb-3 daily-poem__poem-title">
              <h2><b-link
                :to="poem.alias"
                class="text-dark">{{ poem.title }}</b-link></h2>
              <b-link
                @click="showSoundCloud = true"
                v-if="showSoundCloud === false && null !== poem.soundCloud">
                <speaker-icon class="daily-poem__soundcloud-link"/>
              </b-link>
              <b-link
                @click="showSoundCloud = false"
                v-if="showSoundCloud == true">
                <span class="daily-poem__soundcloud-link">&#10005;</span>
              </b-link>
            </div>
            <div
              v-html="poem.text"
              class="daily-poem__poem-text"/>
            <div class="daily-poem__read-the-rest">
              <b-btn
                size="md"
                variant="primary-dark"
                v-b-modal.poemADayModal>read the rest</b-btn>
            </div>
          </article>
        </b-col>
        <div class="daily-poem__sign-up-form d-block d-md-none">
          <AppPoemADaySignUpForm :poem="poem"/>
        </div>
      </b-row>
    </b-container>
    <b-modal
      :title="poem.title"
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
        <AppPoemADaySignUpForm :poem="poem" />
      </template>
    </b-modal>
  </div>
</template>

<script>
import AppPoemADaySignUpForm from "~/components/AppPoemADayPoems/AppPoemADaySignUpForm";
import SpeakerIcon from "~/node_modules/open-iconic/svg/volume-high.svg";
export default {
  name: "DailyPoem",
  components: {
    AppPoemADaySignUpForm,
    SpeakerIcon
  },
  data() {
    return {
      showSoundCloud: false
    };
  },
  props: {
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
.daily-poem {
  background-color: var(--gray-900);
  & + section {
    padding-top: $spacer * 10 !important;
  }
  aside {
    .daily-poem__poet-image {
      display: flex;
      justify-content: flex-end;
    }
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
    flex-basis: 30%;
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
.daily-poem__poem-container.container {
  position: relative;
  max-height: 40rem;
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
  background-color: var(--white);
  border-top: var(--blue) 0.5px solid;
  box-shadow: 0 -3px 0 0 #00b4f0, 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  position: absolute;
}
.daily-poem__poem-text {
  font-size: $font-size-base;
  font-family: $font-family-serif;
  line-height: 1.5rem;
  overflow: hidden;
  max-height: 443px;
  position: relative;
  &:after {
    position: absolute;
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
.daily-poem__read-the-rest {
  position: relative;
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
    max-width: %100;
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
    padding-bottom: $spacer * 2;
    article {
      padding-left: $spacer * 9;
    }
  }
  .daily-poem__poem-text {
    font-size: 1.25rem;
  }
}
</style>

<template>
  <div class="daily-poem pt-4">
    <h3 
      class="daily-poem__poet-name p-2"
      v-if="null !== poet.name">
      {{ poet.name }}
    </h3>
    <b-container>
      <b-row>
        <b-col 
          xs="4"
          tag="aside"
        >
          <div class="pb-3 d-flex daily-poem__poet-image">
            <b-img-lazy
              :src="poet.image"
              fluid
              blank-src="images/gc.png"
              blank-color="#00B4F0"
            />
          </div>
          <div class="daily-poem__sign-up-form">
            <AppPoemADaySignUpForm />
          </div>
        </b-col>
        <div class="col-sm-12 col-md-8 daily-poem__poem-outer">
          <b-container>
            <div class="row">
              <div class="col-sm-4 col-md-3 pt-2 pb-3">
                <div class="daily-poem__daily-poem-label p-3">
                  poem-a-day
                </div>
              </div>
              <div class="col-sm-12 col-md-9">
                <div class="col-sm-12 col-md-8 daily-poem__poem">
                  <div class="daily-poem__poem-title pt-1 pb-3">
                    {{ poem.title }}
                    <b-img
                      src="/images/speaker.png"
                      class="daily-poem__poem-speaker"/>
                  </div>
                  <div
                    v-html="poem.text"
                    class="daily-poem__poem-text"/>
                  <div
                    class="daily-poem__poem-fade-out"/>
                  <div class="daily-poem__read-the-rest mt-3 mb-3 p-2">
                    <a href="#">read the rest</a>
                  </div>
                </div>
              </div>
            </div>
          </b-container>
        </div>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import AppPoemADaySignUpForm from "~/components/AppPoemADayPoems/AppPoemADaySignUpForm";
export default {
  name: "DailyPoem",
  components: {
    AppPoemADaySignUpForm
  },
  props: {
    poem: {
      type: Object,
      default() {
        return {
          text: "",
          title: ""
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

<style scoped lang="scss">
.daily-poem {
  border-top: 4px var(--white) solid;
  background-color: var(--gray-800);
  .daily-poem__poem {
    position: relative;
    z-index: 222;
  }
  .daily-poem__poet-name {
    color: var(--white);
    margin-left: 27%;
  }
  .daily-poem__poet-image {
    justify-content: flex-end;
  }
  .daily-poem__poem-outer {
    background-color: var(--white);
    border-top: var(--blue) 4px solid;
    box-shadow: 0 -3px 0 0 #00b4f0, 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    .daily-poem__daily-poem-label {
      position: relative;
      top: 3px;
      left: -39px;
      background-color: var(--blue);
      font-size: 20px;
    }
    .daily-poem__poem {
      position: relative;
      bottom: 0;
      left: 0;
      width: 100%;
      font-family: $font-family-serif;
      .daily-poem__poem-title {
        font-size: 28px;
        font-style: italic;
      }
      .daily-poem__poem-speaker {
        position: absolute;
        top: 12px;
        left: 444px;
        width: 33px;
      }
      .daily-poem__poem-text {
        font-size: 20px;
        max-height: 443px;
        overflow: hidden;
      }
      .daily-poem__poem-fade-out {
        position: absolute;
        bottom: 63px;
        height: 266px;
        width: 100%;
        background: -webkit-linear-gradient(
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 1)
        );
        background: linear-gradient(
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 1)
        );
      }

      .daily-poem__read-the-rest {
        width: 146px;
        color: var(--white);
        background-color: var(--blue-dark);
        font-family: $font-family-sans-serif;
        text-align: center;
        font-size: 16px;
        font-weight: 500;
        a {
          color: var(--white);
        }
      }
    }
  }
}
</style>

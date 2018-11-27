<template>
  <div class="poem-a-day-container pt-4">
    <div class="poem-a-day__poems">
      <h3 class="poem-a-day-container__poet-name p-2">
        {{ poet.name }}
      </h3>
      <b-container>
        <div class="row">
          <div class="col-4 poem-a-day-container__poet-image">
            <b-img :src="poet.image"/>
            <div class="poem-a-day-container__sign-up-form">
              <AppPoemADaySignUpForm />
            </div>
          </div>
          <div class="col-sm-12 col-md-8 poem-a-day-container__poem-outer">
            <b-container>
              <div class="row">
                <div class="col-sm-4 col-md-3 pt-2 pb-3">
                  <div class="poem-a-day-container__poem-a-day-label p-3">
                    poem-a-day
                  </div>
                </div>
                <div class="col-sm-12 col-md-9">
                  <div class="col-sm-12 col-md-8 poem-a-day-container__poem">
                    <div class="poem-a-day-container__poem-title pt-1 pb-3">
                      {{ poem.title }}
                      <b-img
                        src="/images/speaker.png"
                        class="poem-a-day-container__poem-speaker"/>
                    </div>
                    <div
                      v-html="poem.text"
                      class="poem-a-day-container__poem-text"/>
                    <div
                      class="poem-a-day-container__poem-fade-out"/>
                    <div class="poem-a-day-container__read-the-rest mt-3 mb-3 p-2">
                      <a href="#">read the rest</a>
                    </div>
                  </div>
                </div>
              </div>
            </b-container>
          </div>
        </div>
      </b-container>
    </div>
    <AppPoems />
  </div>
</template>

<script>
import AppPoemADaySignUpForm from "~/components/AppPoemADayPoems/AppPoemADaySignUpForm";
import AppPoems from "~/components/AppPoemADayPoems/AppPoems";
export default {
  name: "DailyPoem",
  components: {
    AppPoemADaySignUpForm,
    AppPoems
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
.poem-a-day-container {
  border-top: 4px var(--white) solid;
  background-color: var(--gray-800);
  .poem-a-day__poems {
    position: relative;
    z-index: 222;
  }
  .poem-a-day-container__poet-name {
    color: var(--white);
    margin-left: 27%;
  }
  .poem-a-day-container__poet-image {
    img {
      width: 311px;
    }
  }
  .poem-a-day-container__poem-outer {
    background-color: var(--white);
    border-top: var(--blue) 4px solid;
    box-shadow: 0 -3px 0 0 #00b4f0, 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    .poem-a-day-container__poem-a-day-label {
      position: relative;
      top: 3px;
      left: -39px;
      background-color: var(--blue);
      font-size: 20px;
    }
    .poem-a-day-container__poem {
      position: relative;
      bottom: 0;
      left: 0;
      width: 100%;
      font-family: $font-family-serif;
      .poem-a-day-container__poem-title {
        font-size: 28px;
        font-style: italic;
      }
      .poem-a-day-container__poem-speaker {
        position: absolute;
        top: 12px;
        left: 444px;
        width: 33px;
      }
      .poem-a-day-container__poem-text {
        font-size: 20px;
        max-height: 443px;
        overflow: hidden;
      }
      .poem-a-day-container__poem-fade-out {
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

      .poem-a-day-container__read-the-rest {
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

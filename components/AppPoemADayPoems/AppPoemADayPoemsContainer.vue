<template>
  <div class="poem-a-day-container pt-4">
    <div
      v-for="poem in poems"
      :key="poem.link"
      class="poem-a-day__poems">
      <h3 class="poem-a-day-container__poet-name p-2">
        {{ poem.poet }}
      </h3>
      <b-container>
        <div class="row">
          <div class="col-4 poem-a-day-container__poet-image">
            <b-img
              :src="poem.image"
            />
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
  components: {
    AppPoemADaySignUpForm,
    AppPoems
  },
  /**
   * @todo replace with real data/prop
   * @return {{ announcements: {date: string, title: string, link: string}[]}}
   */
  data() {
    let poemTitle =
      "It Was Summer Now and the Colored People Came Out Into the Sunshine";
    let poemText = `
      <p>
      Oh, my planet, how beautiful
      you are. Little curve that leads me
      to the lakeside. Let me step out
      </p>
      <p>
      of the sack of skin I wore
      on earth. It’s good to be home.
      No more need to name me. No more
      </p>
      need to make the shape of a machete
      with my mouth. Pushing up up up the tired
      sides that want to drop below my teeth.
      </p>
      <p>
      Lord, I’ve missed you. The streets
      covered all day in light from the moons.
      I was confused all the time. I wanted so much.
      </p>
      <p>
      My hole felt like a gut with an antler
      rammed through it. So lonely and strange
      and always trying to smile. Coin of the realm.
      </p>
      <p>
      And my arms open and my life
      coming in and out of the “ATM.”
      Once I saw a fox leap inside the morning
      </p>
      <p>
      light and made the same shape
      of myself. Once I watched the boats
      and also rocked back and forth.
      </p>
      <p>
      How does every person not cry out
      all the time? Yes, it was good to eat
      doughnuts. Yes. I was blessed by many
      </p>
      <p>
      days of joy. A rabbit in the driveway.
      A rosemary bush with a sorcerer’s cloak
      of spider webs. Brian Eno.
      </p>
      <p>
      The Hammond B3 Organ that never asked
      me who I knew. But that body.
      Like a factory. That mind like a ship
      </p>
      <p>
      built to pile in other bodies. Skin like a
      sow without any of the sow’s equanimity.
      It reflected nothing. Pink skin. Blue eyes
      </p>
      <p>
      hard as an anvil. Like a window with covering
      that refuses the passerby’s gaze. I loved
      the bully power some days. Oh my pleasure
      </p>
      <p>
      in not causing harm. My pride. I’m not like
      so-and-so. My pink skin preaching, my pink skin
      yawping out my other hole, “I did not choke
      </p>
      <p>
      the man with my elbow!” “Would never!”
      “I let all the boys in hoodies walk
      through dark streets.” “I did not shoot
      </p>
      <p>
      them with my guns!” The ship rising
      up inside me. As if the fox felt pride
      for not tearing the bird to pieces. As if
      </p>
      <p>
      the owl’s heart grew large from not
      wrecking the squirrel’s nest. My pink skin
      a sail full of indignation. My eyes pitching
      </p>
      <p>
      across the feed. It is so good to be home
      and yet. I have a ship inside. How can
      the organ welcome me? I’m not a sow
      </p>
      <p>
      on her worst day. Which would be what?
      Breaking from the barn? Eating all the acorns
      and rolling in the mud? No.
      </p>
      <p>
      Her worst would be at my hands
      and on my plate for supper. Grow
      like the tree, the man who heals
      </p>
      <p>
      the bodies said. In every way I became
      the ship rising in the harbor.
      How can I be welcomed after that?
      </p>
`;
    return {
      poems: [
        {
          poet: "Gabrielle Calvocoressi",
          image: "/images/gc.png",
          link: "https://appUrl/announcementId",
          title: poemTitle,
          text: poemText
        }
      ]
    };
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

<template>
  <div class="poems pt-5 pl-5">
    <div class="poems__wrapper pt-5">
      <h2 class="poems__section-header pt-5">
        Poems
      </h2>
      <h3 class="poems__section-counter pb-3">
        <span class="counter-num-label">8,569 poems</span> &gt;
      </h3>
      <b-container>
        <div class="row">
          <div
            v-for="(poem, index) in poems"
            :key="`${index}-${poem.link}`"
            :class="isEven(index)"
            class="col-sm-12 col-md-5 poems__poem-data m-3">
            <a
              :href="poem.link"
              class="poem-card-link">
              <div class="poems__poem__title pt-1 pb-3">
                {{ poem.title }}
              </div>
              <div class="poems__poem__poem">
                {{ poem.poem }}
              </div>
              <div
                class="poem-container__poem-fade-out"/>
              <div class="poems__poem__poet pt-3">
                {{ poem.poet }}
              </div>
              <div class="poems__poem__date">
                {{ poem.date }}
              </div>
            </a>
          </div>
        </div>
      </b-container>
    </div>
  </div>
</template>

<script>
export default {
  /**
   * @todo replace with real data/prop
   * @return {{ poems: {date: string, title: string, link: string}[]}}
   */
  data() {
    let myPoem = `
i know we exist because of what we make. my dad works at a steel mill. he worked at a steel mill my whole life. at the party, the liberal white woman tells me she voted for hillary & wishes bernie won the nomination. i stare in the mirror if i get too lonely. thirsty to see myself i once walked into the lake until i almost drowned. the white woman at the party who might be liberal but might have voted for trump smiles when she tells me how lucky i am. how many automotive components do you think my dad has made.
`;
    return {
      poems: [
        {
          title: "I Walk Into Every Room and Yell",
          poem: myPoem,
          link: "https://appUrl/announcementId",
          poet: "José Olivarez",
          date: "2008"
        },
        {
          title: "Windy Nights",
          poem: myPoem,
          link: "https://appUrl/announcementId",
          poet: "José Olivarez",
          date: "2008"
        },
        {
          title: "when you tie rope and ribbon",
          poem: myPoem,
          link: "https://appUrl/announcementId",
          poet: "José Olivarez",
          date: "2008"
        },
        {
          title: "Windy Days",
          poem: myPoem,
          link: "https://appUrl/announcementId",
          poet: "José Olivarez",
          date: "2008"
        }
      ]
    };
  },
  methods: {
    isEven(X) {
      if (X % 2 == 0) {
        return "even";
      } else {
        return "odd";
      }
    }
  }
};
</script>
<style scoped lang="scss">
.poems {
  position: relative;
  top: -161px;
  z-index: 111;
  background: linear-gradient(90deg, #e6e7e8 0%, #c9cacb 100%);
  .poems__section-header {
    font-family: $font-family-serif;
    font-style: italic;
    font-size: 70px;
  }
  .poems__section-counter {
    font-family: $font-family-sans-serif;
    font-size: 30px;
    font-weight: 500;
    text-align: right;
    width: 40%;
    .counter-num-label {
      text-decoration: underline;
    }
  }
  .poem-card-link {
    text-decoration: none;
    color: var(--black);
  }
  .poems__poem-data {
    background-color: var(--white);
    font-family: $font-family-serif;
    width: 486px;
    overflow: hidden;
    border-bottom: 4px var(--green) solid;
    .poems__poem__title {
      font-size: 28px;
      font-style: italic;
    }
    .poems__poem__poem {
      font-size: 20px;
      height: 333px;
      overflow: hidden;
    }
    .poems__poem__poet {
      font-family: $font-family-sans-serif;
      font-size: 20px;
      font-weight: 500;
    }
    .poems__poem__date {
      font-size: 16px;
    }
    .poem-container__poem-fade-out {
      position: absolute;
      bottom: 73px;
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
  }
  .poems__poem-data.odd {
    position: relative;
    top: -111px;
  }
}
</style>

<template>
  <b-container>
    <b-row>
      <b-col
        sm="12"
        md="10"
      >
        <main id="styleguide">
          <h1 class="my-5 font-serif">Poets.org Styleguide</h1>
          <section class="styleguide-item">
            <h2
              class="styleguide__heading"
              id="Buttons"
            >Buttons</h2>
            <b-button
              class="m-2"
              :variant="button.variant"
              :size="button.size"
              v-for="(button, index) in buttons"
              :key="index"
            >{{ button.size }} {{ button.variant }}</b-button>
          </section>
          <section class="styleguide-item">
            <h2
              class="styleguide__heading"
              id="PoetsDeck"
            >Poets Card Deck</h2>
            <CardDeck
              title="Poets"
              cardtype="Poet"
              :cards="poets"
              :link="poetsLink"
            />
          </section>

          <section class="styleguide-item">
            <h2
              class="styleguide__heading"
              id="PoetsFeaturedDeck"
            >Poets Featured Deck</h2>
            <CardDeck
              :featured="true"
              title="Poets"
              cardtype="Poet"
              class="card-deck--poet--extended"
              :cards="poetsExtended"
              :link="featuredPoetsLink"
            />
          </section>

          <section class="styleguide-item trans-bg-eg">
            <h2
              class="styleguide__heading"
              id="PoetsFeaturedDeck"
            >Poets Featured Deck with background</h2>
            <CardDeck
              title="Poets"
              cardtype="Poet"
              class="card-deck--poet--extended"
              :cards="poetsExtended"
              :link="featuredPoetsLink"
            />
          </section>

          <section class="styleguide-item">
            <h2
              class="styleguide__heading"
              id="PoemCardDeck"
            >Poem Card Deck</h2>
            <CardDeck
              title="Poems"
              cardtype="PoemCard"
              :cards="poems"
              :link="poemsLink"
            />
          </section>

          <section class="styleguide-item">
            <h2
              class="styleguide__heading"
              id="Forms"
            >Forms</h2>
            <StyleguideForm />
          </section>

          <section class="styleguide-item">
            <h2
              class="styleguide__heading"
              id="Features"
            >Features</h2>
            <CardDeck
              title="Features"
              cardtype="FeatureCard"
              :cards="featureCards"
            />
          </section>
          <section class="styleguide-item">
            <h2
              class="styleguide__heading"
              id="FilterTable"
            >Poet List</h2>
            <FilterTable :items="poetListItems" />
          </section>
          <section class="styleguide-item">
            <h2
              class="styleguide__heading"
              id="TeachingCardDeck"
            >Teaching Intro</h2>
            <TeachingIntro
              :cards="teachingCards"
              :text="teachingText"
            />
          </section>
        </main>
      </b-col>
      <b-col
        sm="12"
        md="2"
      >
        <aside class="styleguide__menu p-4">
          <b-nav
            class="border-left"
            vertical
            v-b-scrollspy
          >
            <b-nav-item
              v-for="(item, index) in menu"
              :key="index"
              :href="item.anchor"
            >{{ item.title }}</b-nav-item>
          </b-nav>
        </aside>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import PoemCard from "~/components/Poems/PoemCard";
import Poet from "~/components/Poet";
import CardDeck from "~/components/CardDeck";
import StyleguideForm from "~/components/Form/StyleguideForm";
import FeatureCard from "~/components/FeatureCard";
import FilterTable from "~/components/FilterTable";
import TeachingIntro from "~/components/TeachingIntro";
import * as _ from "lodash";

export default {
  head: {
    bodyAttrs: {
      class: "styleguide"
    }
  },
  layout: "minimal",
  components: {
    PoemCard,
    CardDeck,
    Poet,
    StyleguideForm,
    FeatureCard,
    FilterTable,
    TeachingIntro
  },
  computed: {
    buttons() {
      const sizes = ["sm", "md", "lg"];
      const variants = [
        "default",
        "primary",
        "primary-dark",
        "secondary",
        "success",
        "warning",
        "danger",
        "light",
        "dark",
        "outline-primary",
        "outline-primary-dark",
        "outline-secondary",
        "outline-secondary-dark",
        "outline-success",
        "outline-warning",
        "outline-danger",
        "outline-light",
        "outline-dark",
        "link"
      ];
      return _.flatMap(sizes, size => {
        return _.map(variants, variant => {
          return { size: size, variant: variant };
        });
      });
    },
    menu() {
      return [
        {
          title: "Buttons",
          anchor: "#Buttons"
        },
        {
          title: "Poets Deck",
          anchor: "#PoetsDeck"
        },
        {
          title: "Poets Featured Deck",
          anchor: "#PoetsFeaturedDeck"
        },
        {
          title: "Poem Card Deck",
          anchor: "#PoemCardDeck"
        },
        {
          title: "Forms",
          anchor: "#Forms"
        },
        {
          title: "Features",
          anchor: "#Features"
        },
        {
          title: "Filter Table",
          anchor: "#FilterTable"
        },
        {
          title: "Teaching",
          anchor: "#TeachingCardDeck"
        }
      ];
    }
  },
  data() {
    return {
      featureCards: [
        {
          title: "Emily Skaja: Brute",
          subtitle: "2018 Walt Whiteman Award",
          text:
            "Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Vestibulum id ligula porta felis euismod semper.",
          img: {
            src: "https://placekitten.com/g/500/400",
            alt: "Kitty cat says meow."
          },
          link: {
            href: "blah/blah"
          }
        },
        {
          title: "Mike 'Pirog' Pirog Wins again",
          subtitle: "2005 Best in Show",
          text:
            "Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Aenean lacinia bibendum nulla sed consectetur. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.",
          video:
            "<iframe width='560' height='315' src='https://www.youtube.com/embed/imqapaYAPbY' frameborder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>",
          link: {
            href: "blah/blah"
          }
        },
        {
          title: "Donna Bungard",
          subtitle: "Protector of the Buns",
          text:
            "Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Vestibulum id ligula porta felis euismod semper.",
          img: {
            src: "https://placekitten.com/g/400/450",
            alt: "Kitty cat says meow."
          },
          link: {
            href: "blah/blah"
          }
        }
      ],
      poems: [
        {
          title: "A Poem About a Thing",
          text: `There once was a man from Nantucket
Who kept all his cash in a bucket.
  But his daughter, named Nan,
  Ran away with a man
And as for the bucket, Nantucket.`,
          poet: {
            name: "Dustin LeKensrue"
          },
          year: "2018"
        },
        {
          title: "A Poem About a Thing",
          text: `There once was a man from Nantucket
Who kept all his cash in a bucket.
  But his daughter, named Nan,
  Ran away with a man
And as for the bucket, Nantucket.`,
          poet: {
            name: "Dustin LeKensrue"
          },
          year: "2018"
        },
        {
          title: "A Poem About a Thing",
          text: `There once was a man from Nantucket
Who kept all his cash in a bucket.
  But his daughter, named Nan,
  Ran away with a man
And as for the bucket, Nantucket.`,
          poet: {
            name: "Dustin LeKensrue"
          },
          year: "2018"
        }
      ],
      poets: [
        {
          name: "Dustin LeKensrue",
          bio: "Praesent commodo cursus magna, vel scelerisque nisl consect",
          img: {
            src: "/images/poet.png"
          },
          link: {
            href: "blah/blah"
          }
        },
        {
          name: "Dustin LeKensrue",
          bio: "Praesent commodo cursus magna, vel scelerisque nisl consect",
          img: {
            src: "/images/poet.png"
          },
          link: {
            href: "blah/blah"
          }
        },
        {
          name: "Dustin LeKensrue",
          bio: "Praesent commodo cursus magna, vel scelerisque nisl consect",
          img: {
            src: "/images/poet.png"
          },
          link: {
            href: "blah/blah"
          }
        }
      ],
      poetsExtended: [
        {
          name: "Dustin LeKensrue",
          bio: "Praesent commodo cursus magna, vel scelerisque nisl consect",
          img: {
            src: "/images/poet.png"
          },
          link: {
            href: "blah/blah"
          }
        },
        {
          name: "Dustin LeKensrue",
          bio: "Praesent commodo cursus magna, vel scelerisque nisl consect",
          img: {
            src: "/images/poet.png"
          },
          link: {
            href: "blah/blah"
          }
        },
        {
          name: "Dustin LeKensrue",
          bio: "Praesent commodo cursus magna, vel scelerisque nisl consect",
          img: {
            src: "/images/poet.png"
          },
          link: {
            href: "blah/blah"
          }
        },
        {
          name: "Dustin LeKensrue",
          bio: "Praesent commodo cursus magna, vel scelerisque nisl consect",
          img: {
            src: "/images/poet.png"
          },
          link: {
            href: "blah/blah"
          }
        },
        {
          name: "Dustin LeKensrue",
          bio: "Praesent commodo cursus magna, vel scelerisque nisl consect",
          img: {
            src: "/images/poet.png"
          },
          link: {
            href: "blah/blah"
          }
        },
        {
          cardType: "adCard",
          img: {
            src: "/images/advertisement.png"
          },
          link: {
            href: "blah/blah"
          }
        }
      ],
      poemsLink: {
        href: "blah/blah",
        text: "More Poems"
      },
      poetsLink: {
        href: "blah/blah",
        text: "More Poets"
      },
      featuredPoetsLink: {
        href: "blah/blah",
        text: "3443 Poets"
      },
      poetListItems: [
        {
          schoolsMovements: "Objectivist",
          years: "1978 - Present",
          name: { first: "Dickerson", last: "Macdonald" }
        },
        {
          schoolsMovements: "Objectivist",
          years: "1978 - Present",
          name: { first: "Larsen", last: "Shaw" }
        },
        {
          schoolsMovements: "Objectivist",
          years: "1978 - Present",
          name: { first: "Mini", last: "Navarro" }
        },
        {
          schoolsMovements: "Objectivist",
          years: "1978 - Present",
          name: { first: "Geneva", last: "Wilson" }
        },
        {
          schoolsMovements: "Objectivist",
          years: "1978 - Present",
          name: { first: "Jami", last: "Carney" }
        },
        {
          schoolsMovements: "Objectivist",
          years: "1978 - Present",
          name: { first: "Essie", last: "Dunlap" }
        },
        {
          schoolsMovements: "Objectivist",
          years: "1978 - Present",
          name: { first: "Thor", last: "Macdonald" }
        },
        {
          schoolsMovements: "Objectivist",
          years: "1978 - Present",
          name: { first: "Larsen", last: "Shaw" },
          _cellVariants: { years: "danger", schoolsMovements: "warning" }
        },
        {
          schoolsMovements: "Objectivist",
          years: "1978 - Present",
          name: { first: "Mitzi", last: "Navarro" }
        },
        {
          schoolsMovements: "Objectivist",
          years: "1978 - Present",
          name: { first: "Genevieve", last: "Wilson" }
        },
        {
          schoolsMovements: "Objectivist",
          years: "1978 - Present",
          name: { first: "John", last: "Carney" }
        },
        {
          schoolsMovements: "Objectivist",
          years: "1978 - Present",
          name: { first: "Dick", last: "Dunlap" }
        }
      ],
      teachingText:
        "Here you’ll find poetry lesson plans, essays about teaching, a glossary of poetry terms, and more. And our lesson plans, most of which are aligned with the Common Core, have been reviewed by our Educator in Residence with an eye toward developing skills of perception and imagination.",
      teachingCards: [
        {
          title: "Crafting a Poetic Sensibility",
          text:
            "An essay by our educator in residence, Madeleine Fuchs Holzer, about crafting a poetic sensibility",
          img: {
            src: "/images/poet.png"
          }
        },
        {
          title: "Poems for Kids",
          text:
            "30 selections of poems curated for young people around specific themes",
          img: {
            src: "/images/poet.png"
          }
        },
        {
          title: "Create Online Anthologies",
          text:
            "Instructions on how to create an online anthology of poems to share, right here on Poets.org",
          img: {
            src: "/images/poet.png"
          }
        },
        {
          title: "Poetry Resources for Teens",
          text:
            "Poetry resources for teens, including additional selections of poems curated especially for teens",
          img: {
            src: "/images/poet.png"
          }
        }
      ]
    };
  }
};
</script>

<style lang="scss">
.styleguide {
  position: relative;
}
.styleguide-item {
  margin-bottom: $spacer * 2;
  padding-bottom: $spacer * 2;
}
.styleguide__heading {
  padding-bottom: $spacer / 2;
  margin-bottom: $spacer * 2;
  border-bottom: 1px solid $gray-600;
}
.styleguide__menu {
  position: sticky;
  top: $spacer;
  height: calc(100vh - 4rem);
}
.nav-link.active {
  font-weight: bold;
  color: $black;
}

// Special Background magics.
.trans-bg-eg {
  background-image: url(https://www.teenbookfest.org/img/book-page.jpg);
  background-size: contain;
  background-color: #eee;
  background-blend-mode: overlay;

  .card-deck--poet--extended {
    @include trans-bg--multiply(var(--green));
  }
}
</style>

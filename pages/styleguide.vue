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
              id="Buttons">Buttons</h2>
            <b-button
              class="m-2"
              :variant="button.variant"
              :size="button.size"
              v-for="(button, index) in buttons"
              :key="index">
              {{ button.size }} {{ button.variant }}
            </b-button>
          </section>
          <section class="styleguide-item" >
            <h2
              class="styleguide__heading"
              id="PoetsDeck">Poets Card Deck</h2>
            <CardDeck
              title="Poets"
              cardtype="Poet"
              :cards="poets"
              :link="poetsLink"/>
          </section>

          <section class="styleguide-item">
            <h2
              class="styleguide__heading"
              id="PoetsFeaturedDeck">Poets Featured Deck</h2>
            <CardDeck
              title="Poets"
              cardtype="Poet"
              class="card-deck--poet--extended"
              :cards="poetsExtended"
              :link="featuredPoetsLink"/>
          </section>

          <section class="styleguide-item">
            <h2
              class="styleguide__heading"
              id="PoemCardDeck">Poem Card Deck</h2>
            <CardDeck
              title="Poems"
              cardtype="PoemCard"
              :cards="poems"
              :link="poemsLink" />
          </section>

          <section class="styleguide-item">
            <h2
              class="styleguide__heading"
              id="Forms">Forms</h2>
            <StyleguideForm />
          </section>

          <section class="styleguide-item">
            <h2
              class="styleguide__heading"
              id="Features">Features</h2>
            <CardDeck
              title="Features"
              cardtype="FeatureCard"
              :cards="featureCards" />
          </section>
          <section class="styleguide-item">
            <h2
              class="styleguide__heading"
              id="PoetList">Poet List</h2>
            <PoetList :items="poetListItems" />
          </section>
        </main>
      </b-col>
      <b-col
        sm="12"
        md="2">
        <aside class="styleguide__menu p-4">
          <b-nav
            class="border-left"
            vertical
            v-b-scrollspy>
            <b-nav-item
              v-for="(item, index) in menu"
              :key="index"
              :href="item.anchor">{{ item.title }}</b-nav-item>
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
import PoetList from "~/components/PoetList";
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
    PoetList
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
          title: "Poet List",
          anchor: "#PoetList"
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
          isActive: true,
          age: 40,
          name: { first: "Dickerson", last: "Macdonald" }
        },
        {
          isActive: false,
          age: 21,
          name: { first: "Larsen", last: "Shaw" }
        },
        {
          isActive: false,
          age: 9,
          name: { first: "Mini", last: "Navarro" },
          _rowVariant: "success"
        },
        { isActive: false, age: 89, name: { first: "Geneva", last: "Wilson" } },
        { isActive: true, age: 38, name: { first: "Jami", last: "Carney" } },
        { isActive: false, age: 27, name: { first: "Essie", last: "Dunlap" } },
        { isActive: true, age: 40, name: { first: "Thor", last: "Macdonald" } },
        {
          isActive: true,
          age: 87,
          name: { first: "Larsen", last: "Shaw" },
          _cellVariants: { age: "danger", isActive: "warning" }
        },
        { isActive: false, age: 26, name: { first: "Mitzi", last: "Navarro" } },
        {
          isActive: false,
          age: 22,
          name: { first: "Genevieve", last: "Wilson" }
        },
        { isActive: true, age: 38, name: { first: "John", last: "Carney" } },
        { isActive: false, age: 29, name: { first: "Dick", last: "Dunlap" } }
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
</style>

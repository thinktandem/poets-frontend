<template>
  <div>
    <div class="styleguide-item">
      <CardDeck
        title="Poets"
        cardtype="Poet"
        :cards="poets"
        :link="poetsLink"/>
    </div>

    <div class="styleguide-item">
      <CardDeck
        title="Poems"
        cardtype="PoemCard"
        :cards="poems"
        :link="poemsLink" />
    </div>

    <div class="styleguide-item">
      <StyleguideForm />
    </div>

    <div class="styleguide-item">
      <CardDeck
        title="Features"
        cardtype="FeatureCard"
        :cards="featureCards"
        :link="poemsLink" />
    </div>

    <b-container class="styleguide-item">
      <b-row>
        <b-col cols="12">
          <h2>Poet List</h2>
          <PoetList :items="poetListItems" />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import PoemCard from "~/components/Poems/PoemCard";
import Poet from "~/components/Poet";
import CardDeck from "~/components/CardDeck";
import StyleguideForm from "~/components/Form/StyleguideForm";
import FeatureCard from "~/components/FeatureCard";
import PoetList from "~/components/PoetList";

export default {
  layout: "default",
  components: {
    PoemCard,
    CardDeck,
    Poet,
    StyleguideForm,
    FeatureCard,
    PoetList
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
            src: "https://placekitten.com/g/400/500",
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
      poemsLink: {
        href: "blah/blah",
        text: "More Poems"
      },
      poetsLink: {
        href: "blah/blah",
        text: "More Poets"
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

<style>
.styleguide-item {
  margin-bottom: 4rem;
}
</style>

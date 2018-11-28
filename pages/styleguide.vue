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

    <b-container class="styleguide-item">
      <b-row>
        <b-col cols="12">
          <h2>Feature</h2>
          <FeatureCard v-bind="featurecard" />
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

export default {
  layout: "default",
  components: {
    PoemCard,
    CardDeck,
    Poet,
    StyleguideForm,
    FeatureCard
  },
  data() {
    return {
      featurecard: {
        title: "Emily Skaja: Brute",
        subtitle: "2018 Walt Whiteman Award",
        text:
          "Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Vestibulum id ligula porta felis euismod semper.",
        img: {
          src: "https://placekitten.com/g/400/450",
          alt: "Kitty cat says meow."
        },
        link: {
          href: "blah/blah"
        }
      },
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
      }
    };
  }
};
</script>

<style>
.styleguide-item {
  margin-bottom: 4rem;
}
</style>

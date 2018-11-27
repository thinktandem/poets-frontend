<template>
  <div>
    <CardDeck
      title="Poets"
      cardtype="Poet"
      :cards="poets"
      :link="poetsLink"/>
    <CardDeck
      title="Poems"
      cardtype="PoemCard"
      :cards="poems"
      :link="poemsLink"/>

    <StyleguideForm/>
  </div>
</template>

<script>
import PoemCard from "~/components/Poems/PoemCard";
import Poet from "~/components/Poet";
import CardDeck from "~/components/CardDeck";
import StyleguideForm from "~/components/Form/StyleguideForm";
export default {
  layout: "default",
  components: {
    PoemCard,
    CardDeck,
    Poet,
    StyleguideForm
  },
  data() {
    return {
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
</style>

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

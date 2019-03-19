<template>
  <div class="footer__primary pt-5 pb-5">
    <b-container class="mx-auto">
      <div class="row">
        <div class="col-sm-12 col-md-3">
          <h3 class="footer__primary__links__header">
            poets.org
          </h3>
          <div
            v-for="link in linksPoets"
            :key="link.url"
            class="footer__primary__links p-1">
            <a :href="link.url">{{ link.text }}</a>
          </div>
        </div>
        <div class="col-sm-12 col-md-3">
          <h3 class="footer__primary__links__header">
            academy of american poets
          </h3>
          <div
            v-for="link in linksAcademy"
            :key="link.url"
            class="footer__primary__links p-1">
            <a :href="link.url">{{ link.text }}</a>
          </div>
        </div>
        <div class="col-sm-12 col-md-3">
          <h3 class="footer__primary__links__header">
            national poetry month
          </h3>
          <div
            v-for="link in linksPoetryMonth"
            :key="link.url"
            class="footer__primary__links p-1">
            <a :href="link.url">{{ link.text }}</a>
          </div>
        </div>
        <div class="col-sm-12 col-md-3">
          <h3 class="footer__primary__links__header">
            american poets
          </h3>
          <div
            v-for="link in linksAmericanPoets"
            :key="link.url"
            class="footer__primary__links p-1">
            <a :href="link.url">{{ link.text }}</a>
          </div>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
export default {
  /**
   * @todo: should/can this be a data/prop delivered by drupal?
   * @return {{ links: {text: string, url: string}[]}}`
   */
  data() {
    return {
      linksPoets: [
        {
          text: "Find Poems",
          url: "/poems"
        },
        {
          text: "Find Poets",
          url: "/poets"
        },
        {
          text: "Poems for Kids",
          url: "/materials-teachers/poems-kids"
        },
        {
          text: "Poetry Near You",
          url: "/poetry-near-you"
        },
        {
          text: "Read Stanza",
          url: "/stanza"
        },
        {
          text: "Audio",
          url: "/audio"
        },
        {
          text: "Texts",
          url: "/texts"
        },
        {
          text: "Jobs for Poets",
          url: "/jobs"
        },
        {
          text: "Materials for Teachers",
          url: "/materials-teachers"
        }
      ],
      linksAcademy: [
        {
          text: "Programs",
          url: "/academy-american-poets/programs"
        },
        {
          text: "Prizes",
          url: "/academy-american-poets/american-poets-prizes"
        },
        {
          text: "The Walt Whitman Award",
          url: "/academy-american-poets/prizes/walt-whitman-award"
        },
        {
          text: "James Laughlin Award",
          url: "/academy-american-poets/prizes/james-laughlin-award"
        },
        {
          text: "Ambroggio Prize",
          url: "/academy-american-poets/prizes/ambroggio-prize"
        },
        {
          text: "Chancellors",
          url: "/academy-american-poets/chancellors"
        },
        {
          text: "Mission & History",
          url: "/academy-american-poets/mission-history"
        },
        {
          text: "Staff",
          url: "/academy-american-poets/staff"
        }
      ],
      linksPoetryMonth: [
        {
          text: "Poetry & the Creative Mind",
          url: "/academy-american-poets/programs/poetry-creative-mind"
        },
        {
          text: "Dear Poet Project",
          url: "/national-poetry-month/dear-poet-project-2019"
        },
        {
          text: "Poster",
          url: "/national-poetry-month/form/poster-request-form"
        },
        {
          text: "30 Ways to Celebrate",
          url: "/national-poetry-month/30-ways-celebrate-national-poetry-month"
        },
        {
          text: "Sponsorship",
          url: "/national-poetry-month/sponsors-partners"
        }
      ],
      linksAmericanPoets: [
        {
          text: "Books Noted",
          url: "/american-poets-magazine/books-noted"
        },
        {
          text: "Essays",
          url: "/american-poets-magazine/previous_magazines"
        },
        {
          text: "Back Issues",
          url:
            "https://poets.myshopify.com/collections/american-poets-backissues"
        },
        {
          text: "Advertise",
          url: "/american-poets-magazine/advertising-american-poets"
        }
      ]
    };
  }
};
</script>

<style scoped lang="scss">
.footer__primary {
  background-color: var(--gray-800);
  .footer__primary__links__header {
    color: var(--blue);
  }
}
.footer__primary__links {
  color: var(--white);
  font-weight: 600;
  a {
    color: var(--white);
  }
}
</style>

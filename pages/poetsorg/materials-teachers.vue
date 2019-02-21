<template>
  <div>
    <basic-page
      :body="$store.state.pageData.data.attributes.body.processed"
      :extended-content="$store.state.extendedContent"
      :highlighted="$store.state.highlightedData"
      :call-to-action="callToAction"
      :more="$store.state.relatedContent"
      :sidebar-data="$store.state.sidebarData"/>
    <card-deck
      class="py-4"
      col-size="md"
      :cards="$store.state.bottomContent.cards"
      :cardtype="$store.state.bottomContent.cardType"
      :title="$store.state.bottomContent.title"
      :link="$store.state.bottomContent.link"/>
  </div>
</template>

<script>
import BasicPage from "~/components/BasicPage";
import CardDeck from "~/components/CardDeck";
import qs from "qs";
import * as _ from "lodash";
export default {
  components: {
    BasicPage,
    CardDeck
  },
  data() {
    return {
      callToAction: {
        title: "Teach This Poem",
        text:
          "Inspired by the success of our popular syndicated series Poem-a-Day, we’re pleased to present Teach This Poem, winner of the 2018 Innovations in Reading Prize given by the National Book Foundation.",
        action: {
          text: "Learn More & Sign Up"
        },
        teaserLength: 300,
        img: {
          src: "/images/bulb-book.png",
          alt: "A lightbulb emerging from a book"
        }
      }
    };
  },
  async fetch({ app, store, params }) {
    store.commit("updateSubNavigation", [
      {
        to: "/poetsorg/poems-kids",
        text: "Poems for Kids"
      },
      {
        to: "/poetsorg/poems-teens",
        text: "Poems for Teens"
      },
      {
        to: "/poetsorg/lesson-plans",
        text: "Lesson Plans"
      },
      {
        to: "/poetsorg/essays",
        text: "Essays"
      },
      {
        to: "/poetsorg/teach-this-poem",
        text: "Teach this Poem"
      },
      {
        to: "/poetorg/resources",
        text: "Resources"
      }
    ]);
    return (
      app
        // Start with the 'basic page' essentials
        .$buildBasicPage(app, store, "poetsorg/materials-teachers")
        // Now add in our page specific magic.
        .then(() => {
          const signupBlock = {
            component: "SignupBlock",
            props: {
              title: "Monthly Educator Newsletter",
              text: "Receive monthly updates on lesson plans and more!"
            }
          };
          const sidebar = store.state.sidebarData;
          sidebar.splice(1, 0, signupBlock);
          store.commit("updateSidebarData", sidebar);
          const lessonParams = qs.stringify({
            filter: {
              status: 1
            },
            page: {
              limit: 4
            },
            include: "field_level,field_contributors"
          });
          const lessonRequest = {
            requestId: "lessons",
            uri: `/api/node/lesson_plans?${lessonParams}`,
            action: "view",
            headers: {
              Accept: "application/json"
            }
          };
          const essayParams = qs.stringify({
            filter: {
              status: 1,
              // "on Teaching Poetry" tid
              // @todo make this dynamic
              "field_texttype.tid": 1461
            },
            page: {
              limit: 3
            },
            include: "field_contributors"
          });
          const essayRequest = {
            requestId: "essays",
            uri: `/api/node/texts?${essayParams}`,
            action: "view",
            headers: {
              Accept: "application/json"
            }
          };
          return app.$axios
            .$post("/subrequests?_format=json", [lessonRequest, essayRequest], {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
              }
            })
            .then(response => {
              const lessons = JSON.parse(response.lessons.body);
              store.commit("updateRelatedContent", {
                title: "Lesson Plans",
                cardType: "LessonPlanCard",
                link: {
                  to: "/poetorg/lesson-plans",
                  text: `${lessons.meta.count} Lesson Plans`
                },
                cards: _.map(lessons.data, item => {
                  return {
                    title: item.attributes.title,
                    link: item.attributes.path.alias,
                    meta: _.find(
                      lessons.included,
                      include =>
                        include.id ===
                        item.relationships.field_contributors.data[0].id
                    ).attributes.body.processed,
                    level: _.find(
                      lessons.included,
                      include =>
                        include.id === item.relationships.field_level.data[0].id
                    ).attributes.name
                  };
                })
              });
              const essays = JSON.parse(response.essays.body);
              return store.commit("updateBottomContent", {
                title: "Essays on Teaching Poetry",
                cardType: "EssayCard",
                link: {
                  to: "/poetorg/texts/teaching-poetry",
                  text: `${essays.meta.count} Essays`
                },
                cards: _.map(essays.data, item => {
                  let author = _.find(
                    essays.included,
                    include =>
                      include.id ===
                      item.relationships.field_contributors.data[0].id
                  );
                  return {
                    title: item.attributes.title,
                    year: item.attributes.field_date_published.split("-")[0],
                    poet: { name: "name" },
                    author: author ? author.attributes.title : "",
                    text:
                      item.attributes.body.summary ||
                      item.attributes.body.processed
                  };
                })
              });
            });
        })
    );
  }
};
</script>

<style scoped lang="scss">
</style>

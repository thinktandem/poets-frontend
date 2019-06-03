Poets Post-LaunchArchitectural Guidelines
=========================================

Date: 5.2.2019
Prepared by: @pirog

Purpose
-------

The purpose of this document is to serve as a rough sketch of a future architectural state for the Poets frontend. Specifically, we aim to move towards this state to help address concerns with:

### Maintainability

Currently, the site suffers from significant technical debt; a result of

1. Duplicate code
2. Solving the same problem in different ways
3. Not having a general architectural plan or “guiding light”, such as this document
4. Churn and regression frequency

### Performance

Currently, many pages on the site are not optimized for performance resulting in slower initial load times.

### Accessibility

The lack of a clear, well defined and repeatable structure for _how and where_ things should be done limits the number of people who can efficiently work on the project.

Caveats
-------

This document is meant to be implemented slowly, iteratively and incrementally over the course of a slower-burn, long-term support contract.

**Trying to implement all the recommendations in this document quickly or all at once would likely cause more problems than it solves.**

High Level Architecture
-----------------------

A large deal of the site follows normal and established patterns for a NuxtJS site. This is especially true with regard to third party nuxt modules, plugins, middleware, etc. These areas of the site are generally fine and do not need to be improved.

Our primary problem area, and the main concern this document seeks to address is _getting data from the API, mutating it reliably and without error, passing it into a common, non-overlapping set of components and doing so performantly._

To that end it’s worth defining a few “layers” of the site; where they should go and what they should do.

### API Layer

There exists a work-in-progress Version 2 wrapper for the Poets API over here
https://github.com/thinktandem/poets-frontend/tree/master/plugins/poets-apiv2

Ultimately all API calls should live here. This provides us with common mechanisms to define how requests work, how to handle request errors and allows us to “hide” the nastier, “hard-to-repeat” parts of the JSONAPI query system in favor of an interface of our choosing.

Consider these two examples

```js
const params = stringify({
  filter: {
    status: 1,
    // Teach this poem uuid
    "field_type.id": "fc355e48-c064-42fc-8d89-ad98ec3bb2fb"
  },
  include:
    "field_lesson_plan_content,field_contributors,field_level,field_type",
  page: {
    limit: 1
  },
  sort: "-created"
});
const url = `/api/node/lesson_plans?${params}`;
return app.$axios.$get(url).then(res => {
  const data = _.first(_.get(res, "data"));
  const included = _.get(res, "included");
  return { res, data, included };
});
```

```js
return this.$api
  .getLessonPlan("fc355e48-c064-42fc-8d89-ad98ec3bb2fb")
  .then(res => {
    const data = _.first(_.get(res, "data"));
    const included = _.get(res, "included");
    return { res, data, included };
  })
```

This layer should **_only_** be responsible for wrapping the API and providing a consistent interface.

It **_should_** not attempt to parse data in a way that is specifically coupled to what our front end components want.

Said another way,  you should be able to use this module on a completely different Poets project and still interact with the Poets API in a meaningful way.

### Data Mutation Layer

We have a few examples of this like the Poets User class but this should be an implementation of the API layer that is suited to our application. That means its primary purpose is to serve as a data translation matrix between API responses and things our front end components expect.

This will probably manifest itself as a series of helper modules.

Some advantages of this approach are:

  1. All of these functions are easily unit testable which should help address reliability concerns
  2. Both our front end component’s properties and our API responses will be effectively decoupled meaning that both the API and the components can be used for ALL SORTS OF OTHER THINGS without relying on one another.
  3. We can define components like listing pages in a standardized way eg they all will have “rows”, “pages” etc knowing that there is another part of the code responsible for giving us THE DATA WE DESERVE.
  4. There is a clearer separation of concerns and expectations eg the vue templates can be more focused on how components should work and less concerned about how the data gets there. This clear separation of concerns should help with cognitive load and things “trying to do too much.”

### Pages Layer

We currently are using the NuxtJS pages layer in a few different ways. We should standardize the usage across pages for a more predictable and consistent experience

#### Fetch

Nuxt’s `fetch` function should be used to get and set primary page content (what we are calling “basic pages”) and that is generally it. This will help produce faster page loads and not couple the entire page cache to more dynamic content within that page.

`tl;dr` this means all “basic page” stuff

```js
async fetch({ app, store, params, route, menu }) {
  store.commit("toggleSubMenu", false);
  return app.$buildBasicPage(app, store, "/home");
}
```

**Examples**

  * https://github.com/thinktandem/poets-frontend/blob/master/pages/poems/index.vue#L384

#### Mounted

We are currently using Nuxt’s `asyncData` function to grab a lot of “supplementary” data. This does not seem to provide a ton of obvious benefit and is further complicated by its SSR-Browser duality.

We should standardize around using Vue’s baked-in `mounted` function instead. Additionally, we should replace our usage of `await` unless it is legitimately needed for synchronous behavior with a `Promise.all` wrapper that directly calls either our API or data mutation layer directly.

`tl;dr` this means “everything else” that isn't a basic page.

```js
mounted() {
  Promise.all([
    this.getPoemADay(),
    this.getFeaturedPoems(),
    this.getFeaturedPoets(),
    this.getAnnouncements(),
    this.getLatestMagazine()
  ]);
},
```

This ensures that requests are made in parallel, improving performance and that the underlying API calls are cached separately also improving performance.

**Examples**

  * https://github.com/thinktandem/poets-frontend/blob/master/pages/poems/index.vue#L287

### Components

Our components layer desperately needs to be audited and reviewed especially in light of the proposed architectural changes above. Primary concerns here are

  1. Multiple components doing more or less the same thing
  2. Duplicate code that should be “componentized”
  3. Components that try to “do too much”, specifically components that try to take on responsibilities that the defined layers above have assumed eg “my listing component is directly coupled to a specific API pathway”

There are some components (eg Listing components) that will probably be a significant engineering challenge to refactor but generally, we should be moving towards these kinds of guidelines.

1. My component is generally not directly invoking the API but is instead being fed data from a page or parent.
2. My component should be primarily concerned with the display of incoming data and the user's interaction with that
3. My component can be easily documented and understood by another developer. Do the thought experiment of “would my component fit well in the vue-bootstrap docs or would it stick out like a sore thumb”
4. My component does not duplicate another component or does not duplicate something in Bootstrap eg a pager

There are a few notable exceptions to the above especially POSTy things like login or registration forms that SHOULD be directly invoking the API.

Once we’ve moved more components to align with the above it should become a significantly easier engineering challenge to start consolidating our component set.

There is also a lot of duplicate code for things that should probably be componentized. The big ones that come to mind are

  1. Listing pages for things like /poets, /poems
  2. The filtering mechanisms for such pages

Strategy
--------

How do we implement this document given the scope of support?

STOP DOING THIS
Slowly make changes as we go, judgement calls on when
Get dedicated time for higher ticket items eg listings
whoever is assessing a ticket needs to make a call on whether we can do the above

How do we ensure that ^ is happening?

PUT this in the README, PR ISSUE TEMPLATE, MAKE THIS INTO MARKDOWN, issue template?
BUG DUSTIN about shit

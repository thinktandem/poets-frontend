Poets Frontend Magicks
======================

Getting Started
---------------

The easiest way to get started developing the poets.org frontend magicks is by using [Lando](https://github.com/lando/lando), however if you are feeling pro and desire moar speedz you can also use [yarn](https://yarnpkg.com/en/) straight up.

### 1. Using Lando

**This requires you have Lando 3.0.0-rc.1 or higher**.

Please note that because `nuxt` takes a bit to get going and `lando` only waits so long, your initial start *may* produce red URLs. If this happens we recommend you inspect the status of the start with `lando logs` or `docker logs poetsd8_[appserver|styleguide]_1` and then rerun `lando start` when both the `appserver` and `styleguide` have launched. This should result in green lights across the board.

```bash
# Do everything
lando start

# Lint the codes
lando yarn lint

# Run end to end tests
lando yarn test
```

### 2. Using Yarn

``` bash
# Install dependencies
yarn install

# Copy the .env.example file to .env
# @todo: is this actually needed?
cp .env.example .env

# Serve the frontend with hot reload at localhost:3000
yarn dev

# Run linting
yarn lint

# Run end to end tests
yarn test --config=./codecept.local.json
```

Building for Production
-----------------------

You can also do this via `lando yarn` but makes more sense to use `yarn` straight up. See the `.platform.app.yaml` for the actual production build and deployment steps.

```bash
# Generate the frontend as a static HTML project
yarn generate
```

Resources
---------

For detailed explanation on how all the things work checkout

* [Nuxt.js docs](https://github.com/nuxt/nuxt.js)
* [Vue.js docs](https://vuejs.org/v2/guide/)
* [Boostrap Vue](https://bootstrap-vue.js.org/)

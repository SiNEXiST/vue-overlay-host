# vue-overlay-host

> Management Component for easy overlay-component injection

## Installation

### Using yarn

`yarn add vue-overlay-host`

### Using npm

`npm i --save vue-overlay-host`

## Demo and Docs

`npm run serve`

## Usage

### ES6 Modules / CommonJS

```js
import { VueOverlayHost, VueOverlayHostPlugin } from 'vue-overlay-host';

Vue.use(Vuex);
// Register the component globaly
Vue.component('vue-overlay-host', VueOverlayHost);
// Include the Plugin into Vuex to manage the state
const store = new Vuex.Store({
    // ...
    plugins: [
        // ...
        VueOverlayHostPlugin,
        // ...
    ],
    // ...
});
new Vue({
    // ...
    store,
    // ...
});
```

```html
<template>
    <div id="app">
        <router-view></router-view>
        <!-- Add the overlay-host as last and at the very root of your component -->
        <vue-overlay-host></vue-overlay-host>
    </div>
</template>
```

## Build

Build configuration is located in the `poi.config.js` file, to build just run: `npm run build`, it will build to `cjs` directories.

## Tests

This template uses karma with chai by default, you can change test settings in poi.config.js

`npm run test`
`npm run test:watch`
`npm run test:cov`

## License

This project is licensed under [MIT License](http://en.wikipedia.org/wiki/MIT_License)

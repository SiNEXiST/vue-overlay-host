[![Travis](https://img.shields.io/travis/sinexist/vue-overlay-host.svg?style=flat-square)](https://travis-ci.org/SiNEXiST/vue-overlay-host)
[![npm](https://img.shields.io/npm/v/vue-overlay-host.svg?style=flat-square)](https://www.npmjs.com/package/vue-overlay-host)
[![npm Donwloads](https://img.shields.io/npm/dm/vue-overlay-host.svg?style=flat-square)](https://www.npmjs.com/package/vue-overlay-host)
[![License](https://img.shields.io/github/license/sinexist/vue-overlay-host.svg?style=flat-square)](https://github.com/SiNEXiST/vue-overlay-host/blob/master/LICENSE)

# Vue-Overlay-Host

## About

The Overlay-Host allows you to easily inject your custom Overlay-Components and manage those. It's simple and efficient and isn't hard to install nor to use.

## Installation

Install the Overlay-Host via a package manager of your choice

```sh
# Add the dependency with your package manager
yarn add vue-overlay-host
npm i vue-overlay-host
```

---

Then register the Component and the Vuex-Store Plugin. This is an example with a basic setup

`main.js`
```js
import { OverlayHost, OverlayHostPlugin } from 'vue-overlay-host';

// Register the Overlay-Host Component globally
Vue.component('overlay-host', OverlayHost);

// Register the Plugin to the Store when you initialize it
const store = new Vuex.Store({
    plugins: [OverlayHostPlugin],
});
```

`App.vue`
```html
<template>
    <div>
        <div class="your-app-content"></div>
        <overlay-host />
    </div>
</template>
```

`SampleComponent.vue`
```html
<template>
    <button v-on:click="openSomething()"></button>
</template>

<script>
export default {
    methods: {
        openSomething() {
            this.$store.dispatch('vue-overlay-host/open', {
                component: 'my-modal',
                overlay: {
                    show: true,
                    closeOnClick: true,
                },
                closeOnEscape: true,
            })
            .then(hosted => {
                console.log('modal opened!');
                return hosted.promise;
            })
            .then(() => console.log('modal closed!'));
        }
    }
}
</script>
```

## Example

The hosted vesion can be seen on [the github.io Page!](https://sinexist.github.io/vue-overlay-host/)

For the build of it or to test it locally,
see the `src/main.js`, `src/App.vue` and `src/components/example.vue` Files for more info.

Start up the Example-App by cloning the repo and then:

```sh
# Install the dependencies with your package manager
npm install
yarn install

# Run the serve command to start the local dev server
npm run serve
yarn serve
```

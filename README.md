# Vue-Overlay-Host

> A simple Library to manage overlay components

## Installation

Install the Overlay-Host via a package manager of your choice

```
yarn add vue-overlay-host
```

```
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
```js
<template>
    <div>
        <div class="your-app-content"></div>
        <overlay-host />
    </div>
</template>
```
import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';

import { OverlayHost, OverlayHostPlugin } from './lib';
import Example from './components/Example';
import Toast from './components/Toast';

Vue.config.productionTip = false;
Vue.component('example', Example);
Vue.component('overlay-host', OverlayHost);
Vue.component('toast', Toast);
Vue.use(Vuex);

const store = new Vuex.Store({
  plugins: [OverlayHostPlugin]
});

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')

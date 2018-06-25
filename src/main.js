import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';

import { OverlayHost, OverlayHostPlugin } from './lib';
import Toast from './components/toast';

Vue.config.productionTip = false;
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

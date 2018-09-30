import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify';
import { OverlayHost, OverlayHostPlugin } from 'vue-overlay-host';

import 'vuetify/dist/vuetify.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

import App from './App.vue';

import Example from './components/Example';
import Toast from './components/Toast';

Vue.config.productionTip = false;
Vue.component('example', Example);
Vue.component('overlay-host', OverlayHost);
Vue.component('toast', Toast);
Vue.use(Vuex);
Vue.use(Vuetify);

const store = new Vuex.Store({
    strict: true,
    plugins: [OverlayHostPlugin]
});

new Vue({
    store,
    render: h => h(App)
}).$mount('#app');

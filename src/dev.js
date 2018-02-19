import Vue from "vue";
import Vuex from "vuex";

import { OverlayHost, OverlayHostPlugin } from "./index";
import Toast from "./components/toast";

Vue.component("overlay-host", OverlayHost);
Vue.component("toast", Toast);
Vue.use(Vuex);

const store = new Vuex.Store({
    plugins: [OverlayHostPlugin]
});

new Vue({
    el: "#app",
    template: `
    <div>
        <button @click="trigger">Show Toast</button>
        <overlay-host></overlay-host>
    </div>
    `,
    methods: {
        trigger() {
            this.$store
                .dispatch("overlay-host/show", {
                    component: "toast",
                    class: 'sample',
                    overlay: {
                        show: true,
                        closeOnClick: true,
                    },
                    timeout: -1,
                    closeOnEscape: true,
                    props: {
                        title: "Hello World",
                        message: "Test 123"
                    }
                })
                .then(obj => obj.promise)
                .then(value => {
                    console.log("closed:", value);
                });
        }
    },
    store
});

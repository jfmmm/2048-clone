import Vue from "vue";
import App from "./App.vue";
import VueHotkey from "v-hotkey";
import FitText from "./libs/fit-text/index.js";
import VueProgressBar from "vue-progressbar";
import Vue2TouchEvents from "vue2-touch-events";

import "./styles/global.scss";

Vue.config.productionTip = false;
// Vue.config.devtools = true;

Vue.use(VueHotkey);
Vue.use(FitText);
Vue.use(VueProgressBar, {
  color: "blue",
  failedColor: "blue",
  height: "5px"
});
Vue.use(Vue2TouchEvents);

new Vue({
  render: h => h(App)
}).$mount("#app");

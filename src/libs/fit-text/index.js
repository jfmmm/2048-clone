// https://github.com/robbeman/vue-fit-text

// just registering the component globally
// you don't need to use this if you want to register the component manually

import FitText from "./FitText.vue";

export default {
  install(Vue) {
    Vue.component("FitText", FitText);
  }
};

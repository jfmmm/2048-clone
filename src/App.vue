<template>
  <div id="app" v-touch:swipe="swipeHandler">
    <GameManager v-bind:style="{ opacity: loaded ? 1 : 0 }" ref="gameManager" />
    <vue-progress-bar></vue-progress-bar>
  </div>
</template>

<script>
import Vue from "vue";
import Component from "vue-class-component";
import GameManager from "./components/GameManager";
import FontFaceObserver from "fontfaceobserver";

@Component({
  components: {
    GameManager
  },
  data: () => {
    return {
      loaded: false
    };
  }
})
class App extends Vue {
  mounted() {
    const fonts = [];

    fonts.push(new FontFaceObserver("Chewy").load());
    fonts.push(new FontFaceObserver("Raleway").load());

    Promise.all(fonts).finally(() => {
      this.$Progress.finish();
      this.loaded = true;
    });
  }

  swipeHandler(direction) {
    this.$refs.gameManager.swipeHandler(direction);
  }
}

export default App;
</script>

<style>
#app {
  padding-top: 25px;
  height: 100%;
}
</style>

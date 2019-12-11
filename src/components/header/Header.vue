<template lang="pug">
  <div class="header">
    <div class="firstrow">
      <div class="col right">
        <h1 class="title">2048</h1>
      </div>
      <div class="col left">
        <div class="scoreboard">
          <ScoreContainer msg="Score" v-bind:count="score" ref="score" />
          <ScoreContainer msg="Best" v-bind:count="best" />
        </div>
      </div>
    </div>
    <div class="secondrow">
      <p>Join the numbers and get to the 2048 tile!</p>
      <div class="push"></div>
      <button @click="newGame">New Game</button>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Component from "vue-class-component";
import ScoreContainer from "./ScoreContainer";

@Component({
  components: {
    ScoreContainer
  },
  props: ["score", "best"]
})
class Header extends Vue {
  newGame() {
    this.$emit("start-new-game");
  }

  showScoreIncrement(value) {
    this.$refs.score.showScoreIncrement(value);
  }
}

export default Header;
</script>

<style lang="scss" scoped>
@import "./../../styles/variables";

.header {
  margin-bottom: 10px;
}

.firstrow {
  display: flex;
  flex-direction: row;

  h1.title {
    font-size: 80px;
    font-weight: bold;
    margin: 0;
    display: block;
    float: left;
    padding: 14px 0 0 20px;
    transform: rotate(-10deg);
    color: white;
  }

  h2 {
    margin: 0;
  }

  .col {
    flex-grow: 2;
    display: block;
    margin: 0;
  }

  .scoreboard {
    display: flex;
    flex-direction: row;
  }
}

.secondrow {
  display: flex;
  flex-direction: row;
  padding: 0px 5px;
  margin-bottom: 30px;

  p {
    font-size: 16px;
    color: white;
    font-family: "Raleway", sans-serif;
  }
}
</style>

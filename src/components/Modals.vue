<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="gameover" v-if="gameover">
            <h2>Game Over</h2>
            <button @click="newGame">Restart</button>
          </div>
          <div class="won" v-if="won && !gameover">
            <h2>You Won !!!</h2>
            <button @click="keepPlaying">Continue Playing</button>
            <button @click="newGame">Restart</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  props: ["gameover", "won"]
})
class ScoreContainer extends Vue {
  newGame() {
    this.$emit("start-new-game");
  }
  keepPlaying() {
    this.$emit("keep-playing");
  }
}

export default ScoreContainer;
</script>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  text-align: center;

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
    animation: modalAppear 500ms;

    .modal-container {
      margin: 200px auto 0 auto;
      width: 300px;
      padding: 20px 30px;

      h2 {
        font-size: 3em;
        font-family: Chewy, cursive;
        letter-spacing: 4px;
      }

      button {
        padding: 10px 20px;
        margin: 5px;
      }
    }
  }

  .won {
    margin-top: 120px;
  }

  .gameover {
    margin-top: 140px;
  }

  @keyframes modalAppear {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }
}
</style>

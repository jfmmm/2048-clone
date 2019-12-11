<template>
  <div class="container">
    <h2>{{ msg }}</h2>
    <p>{{ count }}</p>
    <IncrementParticle
      v-for="(particle, index) in incrementParticle"
      v-bind:key="`particle-${index}`"
      v-bind:count="particle.count"
    />
  </div>
</template>

<script>
import Vue from "vue";
import Component from "vue-class-component";
import IncrementParticle from "./IncrementParticle";

@Component({
  components: { IncrementParticle },
  props: ["msg", "count"]
})
class ScoreContainer extends Vue {
  incrementParticle = [];

  showScoreIncrement(value) {
    this.incrementParticle.push({ count: value });
  }
}

export default ScoreContainer;
</script>

<style lang="scss" scoped>
.container {
  padding: 30px 20px 0px;
  color: white;
  position: relative;

  h2 {
    letter-spacing: 0.1em;
    font-weight: bold;
    margin: 0;
    font-family: "Raleway", sans-serif;
  }

  p {
    margin: 0;
    font-size: 20px;
  }
}
</style>

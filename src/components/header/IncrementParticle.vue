<template>
  <div class="particle">+ {{ count }}</div>
</template>

<script>
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  props: ["count"]
})
class IncrementParticle extends Vue {
  mounted() {
    setTimeout(() => {
      this.$destroy();
      this.$el.parentNode.removeChild(this.$el);
    }, 1000);
  }
}

export default IncrementParticle;
</script>

<style lang="scss" scoped>
@import "./../../styles/variables";

.particle {
  color: $hiendColor;
  font-size: 20px;
  position: absolute;
  top: 10px;
  left: 40px;
  animation: fadeAway 1000ms linear forwards;
}

@keyframes fadeAway {
  0% {
    transform: translate(0px, 0px);
    opacity: 1;
  }
  100% {
    transform: translate(0px, -50px);
    opacity: 0;
  }
}
</style>

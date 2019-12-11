<template>
  <transition :name="transition" v-on:before-appear="beforeAppear" v-on:appear="appear">
    <div
      class="tile"
      v-if="tile"
      v-bind:class="{
        [tile.value < 2048 ? `tile-${tile.value}` : 'tile-infinite']: true
      }"
    >
      <div class="container">
        <div class="value">
          <FitText v-bind:min="1" v-bind:max="4">{{ tile.value }}</FitText>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Vue from "vue";
import Component from "vue-class-component";
import Velocity from "velocity-animate";

@Component({
  components: {},
  props: ["tile"]
})
class Tile extends Vue {
  get transition() {
    if (this.$props.tile && this.$props.tile.transition) {
      return this.$props.tile.transition;
    } else {
      return undefined;
    }
  }

  /**
   * Set the initial position of tiles before they appear
   */
  beforeAppear(el) {
    const tile = this.$props.tile;

    /**
     * Tile that will move need to start at their last position
     */
    if (tile && ["move", "mergedAway"].includes(tile.transition)) {
      el.style.left = tile.from.x * 100 + "px";
      el.style.top = tile.from.y * 100 + "px";

      // @TODO: Figure out why translate won't work properly for tile position when animating.
      // Should be able to just switch the commented line with the current code. But currently tile move
      // in diagonal sometime..

      // el.style.transform = `translate(${tile.from.x * 100 + "%"}, ${tile.from
      //   .y *
      //   100 +
      //   "%"})`;
    } else {
      el.style.left = tile.x * 100 + "px";
      el.style.top = tile.y * 100 + "px";

      // el.style.transform = `translate(${tile.x * 100 + "%"}, ${tile.y * 100 +
      //   "%"})`;
    }
  }

  /**
   * Animate the tile that need to move
   */
  appear(el, done) {
    const tile = this.$props.tile;

    if (tile && tile.transition === "move") {
      Velocity(
        el,
        {
          left: tile.x * 100 + "px",
          top: tile.y * 100 + "px"
        },
        { duration: 200, complete: done }
      );

      // Velocity(
      //   el,
      //   {
      //     translateX: tile.x * 100 + "%",
      //     translateY: tile.y * 100 + "%"
      //   },
      //   { duration: 200, complete: done }
      // );
    } else if (tile && tile.transition === "mergedAway") {
      Velocity(
        el,
        {
          left: tile.x * 100 + "px",
          top: tile.y * 100 + "px",
          opacity: 0
        },
        { duration: 200, complete: done }
      );

      // Velocity(
      //   el,
      //   {
      //     translateX: tile.x * 100 + "%",
      //     translateY: tile.y * 100 + "%",
      //     opacity: 0
      //   },
      //   { duration: 200, complete: done }
      // );
    }
  }
}

export default Tile;
</script>

<style lang="scss" scoped>
@import "./../styles/variables";

@each $count, $color, $index in $colors {
  $currentGlow: map-get($glow, $count);

  .tile-#{$count} {
    .container {
      box-shadow: 1px 2px 0 darken($color, 15%), 2px 2px $currentGlow lighten($color, 0%),
        2px 2px 10px rgba(0, 0, 0, 0.35);
      background: $color;
    }
  }
}

.tile-infinite .container {
  background: $tileColor;

  .value {
    color: white;
    box-shadow: 1px 2px 0 darken($tileColor, 10%), 2px 2px 10px lighten($tileColor, 0%),
      2px 2px 10px rgba(0, 0, 0, 0.35);
  }
}

.new-tile-enter-to {
  animation: appear 300ms;
}
@keyframes appear {
  0% {
    transform: scale(0.5);
  }
  100% {
    transform: scale(1);
  }
}

.merged-enter-to {
  animation: merge 0.4s;
}
@keyframes merge {
  0% {
    transform: scale(1);
  }
  30% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}

.tile {
  width: $tileSize;
  height: $tileSize;
  position: absolute;
  top: 0;
  left: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  .container {
    width: 90px;
    height: 90px;
    display: inline-block;
    border-radius: 8px;
  }

  .value {
    text-align: center;
    width: 90px;
    height: 90px;
    display: block;
    margin: auto;
    line-height: 90px;
    border-radius: 10px;
    color: $tileColor;

    span {
      width: 80px;
      display: inline-block;
      overflow-wrap: break-word;
      font-weight: 100;
      transform: rotate(-10deg);
    }
  }
}
</style>

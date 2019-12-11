<template>
  <div class="gridContainer">
    <div class="grid">
      <Tile v-for="(tile, index) in tiles" v-bind:key="`${index}-${generateGuid()}`" v-bind:tile="tile" />
    </div>
    <div class="background">
      <div class="background-tile" v-for="index in size * size" :key="index"></div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Component from "vue-class-component";
import Tile from "./Tile";

/**
 * @typedef {object} tileToRender
 * @param {string} transition The transition, one of [move, merged, mergedAway, new-tile]
 * @param {position} [from] original position for tile that move during this turn
 * @param {number} x x
 * @param {number} y y
 * @param {number} value The value
 */

@Component({
  components: { Tile },
  props: ["size"]
})
class Grid extends Vue {
  cells = {};

  /**
   * Generate a guid
   * @returns {string}
   */
  generateGuid() {
    // Not sure if this is needed or if there a better way in Vue. But I need the appear events
    // to trigger for all tile each move and they won't if vue try to be smart an reuse elements
    // with the array index.

    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Return an array of tile to be rendered every move.
   * Rerender every turn.
   * @returns {tileToRender[]}
   */
  get tiles() {
    const tiles = [];

    for (let y = 0; y < this.$props.size; y++) {
      for (let x = 0; x < this.$props.size; x++) {
        const tile = this.cells[`${x}-${y}`];
        if (tile) {
          if (tile.previousPosition) {
            // Tile that only move
            tiles.push({
              transition: "move",
              from: { x: tile.previousPosition.x, y: tile.previousPosition.y },
              x: tile.x,
              y: tile.y,
              value: tile.value
            });
          } else if (tile.mergedFrom) {
            // Tile that get merged
            tiles.push({
              transition: "merged",
              x: tile.x,
              y: tile.y,
              value: tile.value
            });

            // Render the tiles that merged
            tile.mergedFrom.forEach(function(merged) {
              if (tile.x !== merged.previousPosition.x || tile.y !== merged.previousPosition.y) {
                tiles.push({
                  transition: "mergedAway",
                  from: {
                    x: merged.previousPosition.x,
                    y: merged.previousPosition.y
                  },
                  x: tile.x,
                  y: tile.y,
                  value: merged.value
                });
              }
            });
          } else {
            // New tile
            tiles.push({
              transition: "new-tile",
              x: tile.x,
              y: tile.y,
              value: tile.value
            });
          }
        }
      }
    }

    return tiles;
  }

  /**
   * Move a tile and its representation
   * @param {Tile} tile The tile
   * @param {position} newPosition The new position
   */
  moveTile(tile, newPosition) {
    if (tile.x !== newPosition.x || tile.y !== newPosition.y) {
      Vue.set(this.cells, `${tile.x}-${tile.y}`, null);
      tile.updatePosition(newPosition);
      Vue.set(this.cells, `${newPosition.x}-${newPosition.y}`, tile);
    }
  }

  /**
   * Insert a tile to the grid
   * @param {Tile} tile The tile
   */
  insertTile(tile) {
    Vue.set(this.cells, `${tile.x}-${tile.y}`, tile);
  }

  /**
   * Build an empty grid
   */
  empty() {
    for (let x = 0; x < this.$props.size; x++) {
      for (let y = 0; y < this.$props.size; y++) {
        Vue.set(this.cells, `${x}-${y}`, null);
      }
    }
  }

  /**
   * Find a random available tile
   * @returns {Tile}
   */
  randomAvailableCell() {
    const cells = this.availableCells();

    if (cells.length) {
      return cells[Math.floor(Math.random() * cells.length)];
    }
  }

  /**
   * Return an array of all available tiles
   * @returns {Tile[]}
   */
  availableCells() {
    const cells = [];

    this.eachCell(function(x, y, tile) {
      if (!tile) {
        cells.push({ x: x, y: y });
      }
    });

    return cells;
  }

  /**
   * This callback is displayed as part of the Requester class.
   * @callback eachCellCallback
   * @param {number} x x
   * @param {number} y y
   * @param {Tile} tile The tile
   */

  /**
   * Iterate on every tiles and call a callback function
   * @param {eachCellCallback} callback The callback
   */
  eachCell(callback) {
    for (let x = 0; x < this.$props.size; x++) {
      for (let y = 0; y < this.$props.size; y++) {
        callback(x, y, this.cells[`${x}-${y}`]);
      }
    }
  }

  /**
   * Check if any cell are available
   * @returns {boolean}
   */
  cellsAvailable() {
    return !!this.availableCells().length;
  }

  // Check if the specified cell is taken

  /**
   * Check if a cell is taken
   * @returns {boolean}
   */
  cellAvailable(cell) {
    return !this.cellContent(cell);
  }

  /**
   * Return the content a of position
   * @param {position} position The position
   * @returns {Tile|null}
   */
  cellContent(position) {
    if (this.withinBounds(position)) {
      return this.cells[`${position.x}-${position.y}`];
    } else {
      return null;
    }
  }

  /**
   * @param {Tile} tile The tile
   */
  removeTile(tile) {
    Vue.set(this.cells, `${tile.x}-${tile.y}`, null);
  }

  /**
   * Check if a position is withing bound.
   * @param {position} position The position ot check
   */
  withinBounds(position) {
    return position.x >= 0 && position.x < this.$props.size && position.y >= 0 && position.y < this.$props.size;
  }
}

export default Grid;
</script>

<style lang="scss" scoped>
@import "./../styles/variables";

.grid {
  position: relative;
  border-radius: 10px;
}

.gridContainer {
  padding: 20px;
  background: $mainColor;
  border-radius: 20px;
  box-shadow: 5px 5px 0 darken($mainColor, 10%), 10px 10px 10px rgba(0, 0, 0, 0.35);
}

.background {
  background: $mainColor;
  display: grid;
  grid-template-columns: repeat(4, minmax(98px, 1fr));

  .background-tile {
    $padding: 5px;
    background: $background;
    border-radius: 10px;
    margin: $padding;
    width: $tileSize - $padding * 2;
    height: $tileSize - $padding * 2;
  }
}
</style>

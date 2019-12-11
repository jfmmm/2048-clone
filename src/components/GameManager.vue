<template>
  <div class="game">
    <Header v-on:start-new-game="restart" v-bind:score="score" v-bind:best="best" ref="header" />
    <Grid v-hotkey="keymap" ref="grid" v-bind:size="size" />
    <div v-if="isGameTerminated()" class="gameover"></div>
    <p>
      <span class="bold">HOW TO PLAY:</span> Use your arrow keys to move the tiles. When two tiles with the same number
      touch, they merge into one!
    </p>
    <p>
      Created by Jean-François Morin (2019). Based on 2048 from Gabriele Cirulli who was based on 1024 by Veewo Studio
      and conceptually similar to Threes by Asher Vollmer.
    </p>
    <Modals
      v-on:start-new-game="restart"
      v-on:keep-playing="keepPlaying = true"
      v-if="isGameTerminated()"
      v-bind:won="won"
      v-bind:gameover="over"
    ></Modals>
  </div>
</template>

<script>
import Vue from "vue";
import Component from "vue-class-component";

import { direction, gridSize } from "../constants";

// Components
import Grid from "./Grid";
import Header from "./header/Header";
import Modals from "./Modals";

// Classes
import Tile from "./../classes/Tile";

/**
 * @typedef {import('./../classes/Tile').default} position
 */

/**
 * @typedef {object} vector
 * @param {number} x
 * @param {number} y
 */

/**
 * @typedef {object} traversal
 * @param {position[]} x
 * @param {position[]} y
 */

/**
 * @typedef {object} farthestPositionReturn
 * @param {position} farthest The farthest position found
 * @param {position} next The next one to watch for merge
 */

@Component({
  components: { Header, Grid, Modals }
})
class GameManager extends Vue {
  startTileCount = 2;
  over = false;
  won = false;
  keepPlaying = false;
  size = gridSize;
  score = 0;
  best = 0;

  mounted() {
    this.setupBoard();
  }

  /**
   * Handle keypress
   */
  get keymap() {
    return {
      left: this.move.bind(this, direction.LEFT),
      right: this.move.bind(this, direction.RIGHT),
      up: this.move.bind(this, direction.UP),
      down: this.move.bind(this, direction.DOWN),
      a: this.move.bind(this, direction.LEFT),
      d: this.move.bind(this, direction.RIGHT),
      w: this.move.bind(this, direction.UP),
      s: this.move.bind(this, direction.DOWN),
      r: this.restart.bind(this)
    };
  }

  /**
   * handle swipe on mobile devices
   */
  swipeHandler(swipeDirection) {
    switch (swipeDirection) {
      case "left":
        this.move(direction.LEFT);

        break;
      case "right":
        this.move(direction.RIGHT);

        break;
      case "top":
        this.move(direction.UP);

        break;
      case "bottom":
        this.move(direction.DOWN);

        break;

      default:
        break;
    }
  }

  /**
   * Return true if the game is lost, or has won and the user hasn't kept playing
   */
  isGameTerminated() {
    return !!this.over || (this.won && !this.keepPlaying);
  }

  /**
   * Save the game to local storage
   */
  savegame() {
    const save = {
      score: this.score,
      keepPlaying: this.keepPlaying,
      won: this.won,
      over: this.over,
      tiles: []
    };

    this.$refs.grid.eachCell((x, y, tile) => {
      if (tile) {
        save.tiles.push({ x: tile.x, y: tile.y, value: tile.value });
      }
    });

    localStorage.save = JSON.stringify(save);
    localStorage.best = this.best;
  }

  /**
   * Restart the game.
   */
  restart() {
    this.$refs.grid.empty();
    this.score = 0;
    this.won = false;
    this.over = false;
    this.keepPlaying = false;
    this.addStartTile();
    this.savegame();
  }

  /**
   * Setup the board, either load a previous state or spawm starting tiles randomly.
   */
  setupBoard() {
    if (localStorage.save) {
      const save = JSON.parse(localStorage.save);

      this.score = save.score;
      this.keepPlaying = save.keepPlaying;
      this.won = save.won;
      this.over = save.over;
      this.best = localStorage.best || 0;
      save.tiles.forEach(tile => {
        this.$refs.grid.insertTile(new Tile({ x: tile.x, y: tile.y }, tile.value));
      });
    } else {
      this.addStartTile();
    }

    // Leaving this here for quick debugging purpose, comment the line over this.
    // this.$refs.grid.empty();
    // this.$refs.grid.insertTile(new Tile({ x: 0, y: 0 }, 2));
    // this.$refs.grid.insertTile(new Tile({ x: 0, y: 1 }, 4));
    // this.$refs.grid.insertTile(new Tile({ x: 0, y: 2 }, 8));
    // this.$refs.grid.insertTile(new Tile({ x: 0, y: 3 }, 16));
    // this.$refs.grid.insertTile(new Tile({ x: 1, y: 0 }, 32));
    // this.$refs.grid.insertTile(new Tile({ x: 1, y: 1 }, 64));
    // this.$refs.grid.insertTile(new Tile({ x: 1, y: 2 }, 128));
    // this.$refs.grid.insertTile(new Tile({ x: 1, y: 3 }, 256));
    // this.$refs.grid.insertTile(new Tile({ x: 2, y: 0 }, 512));
    // this.$refs.grid.insertTile(new Tile({ x: 2, y: 1 }, 1024));
    // this.$refs.grid.insertTile(new Tile({ x: 2, y: 2 }, 2048));
    // this.$refs.grid.insertTile(new Tile({ x: 2, y: 3 }, 4096));
    // this.$refs.grid.insertTile(new Tile({ x: 3, y: 0 }, 8192));
    // this.$refs.grid.insertTile(new Tile({ x: 3, y: 1 }, 16384));
    // this.$refs.grid.insertTile(new Tile({ x: 3, y: 2 }, 32768));
    // this.$refs.grid.insertTile(new Tile({ x: 3, y: 3 }, 32768));
  }

  /**
   * Add starting tile randomly
   */
  addStartTile() {
    for (var i = 0; i < this.startTileCount; i++) {
      this.addRandomTile();
    }
  }

  /**
   * Add a random tile in a free spot.
   */
  addRandomTile() {
    if (this.$refs.grid.cellsAvailable()) {
      var value = Math.random() < 0.9 ? 2 : 4; // 2's 90%, 4's 10% of the time
      var position = this.$refs.grid.randomAvailableCell();
      this.$refs.grid.insertTile(new Tile(position, value));
    }
  }

  /**
   * Save all tile positions and remove merger info
   */
  prepareTiles() {
    this.$refs.grid.eachCell(function(x, y, tile) {
      if (tile) {
        tile.mergedFrom = null;
        tile.savePosition();
      }
    });
  }

  /**
   * Move a tile and its representation
   * @param {Tile} tile The tile to move
   * @param {position} newPosition The new position
   */
  moveTile(tile, newPosition) {
    this.$refs.grid.moveTile(tile, newPosition);
  }

  // Move tiles on the grid in the specified direction

  /**
   * Move tiles on the grid in the specified direction
   * @param {number} direction The direction of the move
   */
  move(direction) {
    if (this.isGameTerminated()) return; // Don't do anything if the game's over

    var position, tile;

    var vector = this.getVector(direction);

    var traversals = this.buildTraversals(vector);

    var moved = false;

    // Save the current tile positions and remove merger information
    this.prepareTiles();

    // Traverse the grid in the right direction and move tiles
    traversals.x.forEach(x => {
      traversals.y.forEach(y => {
        position = { x: x, y: y };

        tile = this.$refs.grid.cellContent(position);

        if (tile) {
          var positions = this.findFarthestPosition(position, vector);

          var next = this.$refs.grid.cellContent(positions.next);

          if (next && next.value === tile.value && !next.mergedFrom) {
            var merged = new Tile(positions.next, tile.value * 2);

            merged.mergedFrom = [tile, next];

            this.$refs.grid.insertTile(merged);
            this.$refs.grid.removeTile(tile);

            // Converge the two tiles' positions
            tile.updatePosition(positions.next);

            this.updateScore(merged.value);

            // The mighty 2048 tile
            if (merged.value === 2048) this.won = true;
          } else {
            this.moveTile(tile, positions.farthest);
          }

          if (!this.positionsEqual(position, tile)) {
            moved = true; // The tile moved from its original cell!
          }
        }
      });
    });

    if (moved) {
      this.addRandomTile();

      if (!this.movesAvailable()) {
        this.over = true; // Game over!
      }

      this.savegame();
    }
  }

  /**
   * Update the score
   * @param {number} value The number of point to add to the score
   */
  updateScore(value) {
    this.score += value;
    if (this.best <= this.score) {
      this.best = this.score;
    }
    this.$refs.header.showScoreIncrement(value);
  }

  /**
   * Get the vector representing the chosen direction
   * @param {number} direction The direction to convert
   * @returns {vector}
   */
  getVector(direction) {
    // Vectors representing tile movement
    var map = {
      0: { x: 0, y: -1 }, // Up
      1: { x: 1, y: 0 }, // Right
      2: { x: 0, y: 1 }, // Down
      3: { x: -1, y: 0 } // Left
    };

    return map[direction];
  }

  /**
   * Build a list of positions to traverse in the right order
   * @param {vector} vector The direction as a vector
   * @returns {traversal}
   */
  buildTraversals(vector) {
    var traversals = { x: [], y: [] };

    for (var pos = 0; pos < this.size; pos++) {
      traversals.x.push(pos);
      traversals.y.push(pos);
    }

    // Always traverse from the farthest cell in the chosen direction
    if (vector.x === 1) traversals.x = traversals.x.reverse();
    if (vector.y === 1) traversals.y = traversals.y.reverse();

    return traversals;
  }

  /**
   * Found the farthest position a tile can go until an obstacle is found
   * @param {vector} vector The direction as a vector
   * @returns {farthestPositionReturn}
   */
  findFarthestPosition(position, vector) {
    var previous;

    do {
      previous = position;
      position = { x: previous.x + vector.x, y: previous.y + vector.y };
    } while (this.$refs.grid.withinBounds(position) && this.$refs.grid.cellAvailable(position));

    return {
      farthest: previous,
      next: position
    };
  }

  /**
   * Check if a move is still possible.
   * @returns {boolean}
   */
  movesAvailable() {
    return this.$refs.grid.cellsAvailable() || this.tileMatchesAvailable();
  }

  /**
   * Check if any tiles has an available match
   * @returns {boolean}
   */
  tileMatchesAvailable() {
    var tile;

    for (var x = 0; x < this.size; x++) {
      for (var y = 0; y < this.size; y++) {
        tile = this.$refs.grid.cellContent({ x: x, y: y });

        if (tile) {
          for (var direction = 0; direction < this.size; direction++) {
            var vector = this.getVector(direction);
            var cell = { x: x + vector.x, y: y + vector.y };

            var other = this.$refs.grid.cellContent(cell);

            if (other && other.value === tile.value) {
              return true; // These two tiles can be merged
            }
          }
        }
      }
    }

    return false;
  }

  /**
   * Check if two possition are equal
   * @param {position} first The first position
   * @param {position} second The second position
   * @returns {boolean}
   */
  positionsEqual(first, second) {
    return first.x === second.x && first.y === second.y;
  }
}

export default GameManager;
</script>

<style lang="scss" scoped>
.game {
  width: 440px;
  margin: 0 auto;
}

.modal {
  background: black;
  position: absolute;
}

p {
  margin-top: 30px;
  font-family: "Raleway", sans-serif;
  text-align: justify;
  color: white;

  span.bold {
    font-weight: bold;
  }
}
</style>

export default class Tile {
  x;
  y;
  value;
  previousPosition;
  mergedFrom;

  /**
   * @typedef {object} position
   * @param {number} x
   * @param {number} y
   */

  /**
   * Constructor
   * @param {position} position Tile position
   * @param {number} value Tile value
   */
  constructor(position, value) {
    this.x = position.x;
    this.y = position.y;
    this.value = value || 2;

    this.previousPosition = null;
    this.mergedFrom = null; // Tracks tiles that merged together
  }

  /**
   * Save the current position for reference later
   */
  savePosition() {
    this.previousPosition = { x: this.x, y: this.y };
  }

  /**
   * Update the current position
   * @param {position} position The new position
   */
  updatePosition(position) {
    this.x = position.x;
    this.y = position.y;
  }
}

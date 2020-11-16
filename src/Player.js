/**
 * Module for Player
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Class Represents a player.
 *
 * @class
 */
export class Player {
  /**
   * Create a player.
   *
   * @param {string} playerName - The name of the player.
   */
  constructor (playerName) {
    this.playerName = playerName
    this.hand = []
    this.totVal = 0
  }

  /**
   * Returns a string including player name, cards in the hand and the total value.
   *
   * @returns {string} - String returning name, hand and total value
   * @function toString
   */
  toString () {
    return this.playerName + ' ' + this.hand + ' ' + `(${this.totVal})`
  }
}

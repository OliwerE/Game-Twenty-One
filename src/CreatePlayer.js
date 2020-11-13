/**
 * Module for Player
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

export class CreatePlayer {
  constructor (playerName, hand, totVal) {
    this.playerName = playerName
    this.hand = []
    this.totVal = 0
  }

  toString () {
    return this.playerName + ' ' + this.hand + ' ' + `(${this.totVal})`
  }
}

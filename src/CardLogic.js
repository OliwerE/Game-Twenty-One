/**
 * Module for Card logic
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

import { Deck } from './Deck.js'

/**
 * Represents the card logic.
 *
 * @class
 */
export class CardLogic {
  /**
   * A method deciding if ace should be worth 1 or 14.
   *
   * @function aceCheck
   * @param {number} playerId - A number corresponding to a player index in the players array.
   */
  aceCheck (playerId) {
    var aceCount = 0
    for (let i = 0; i < this._players[playerId].hand.length; i++) { // adds one to aceCount each time an ace is found
      if (this._players[playerId].hand[i].rank === 1) {
        aceCount += 1
      }
    }
    var extraAceValue = 13 * aceCount
    var altTotVal = this._players[playerId].totVal + extraAceValue
    if (aceCount > 0 && this._players[playerId].totVal < 21) {
      if ((this._players[playerId].totVal + extraAceValue) <= 21) { // Changes ace value to 14 if new total value is equal or less than 21.
        this._players[playerId].totVal = altTotVal
      }
    }
  }

  /**
   * A method that sums cards in the players or dealers hand.
   *
   * @function sumCards
   * @param {number} playerId - A number corresponding to a player or dealer index in the players array.
   */

  sumCards (playerId) {
    const handLength = this._players[playerId].hand.length // Length of playerId hand
    let newTotVal = 0
    for (let a = 0; a <= handLength - 1; a++) { // Sum cards value
      newTotVal = newTotVal + this._players[playerId].hand[a].rank
    }
    this._players[playerId].totVal = newTotVal
  }

  /**
   * A method moving used cards to deck and shuffles again when deck is empty.
   *
   * @function reShuffleCards
   */
  reShuffleCards () {
    this._deck = this._deck.concat(this._deckUsed.concat(this._deckUsed.splice(0, this._deckUsed.length))) // moves deckUsed cards back to deck
    if (this._deck.length < 2) { // if deck still equals one after moving deckUsed to deck.
      process.exitCode = 1
      throw new Error('Too many players, the amount of cards are not enough')
    }
    Deck.shuffle(this._deck)
  }

  /**
   * A method that gives player or dealer new card or cards.
   *
   * @function dealerPlayerNewCard
   * @param {number} playerId - A number corresponding to a player or dealer index in the players array.
   * @param {number} maxtotVal - A total value when the dealer or player stops taking more cards.
   */
  dealerPlayerNewCard (playerId, maxtotVal) {
    for (let i = 0; this._players[playerId].totVal < maxtotVal; i++) {
      if (this._deck.length === 1) {
        this.reShuffleCards() // Moves cards back to deck and shuffles.
      } else if (this._deck.length === 0) {
        process.exitCode = 27
        throw new Error('deck is empty')
      } else {
        if (this._players[playerId].hand.length === 5) {
          break
        }
        this._players[playerId].hand = this._players[playerId].hand.concat(this._deck.splice(0, 1))
        this.sumCards(playerId)
      }
      this.aceCheck(playerId)
    }
  }
}

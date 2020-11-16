/**
 * Module for Game
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */
import { Deck } from './Deck.js'
import { Player } from './Player.js'
import { CardLogic } from './CardLogic.js'
import { Result } from './Results.js'

/**
 * Represents the game twenty one
 *
 * @class
 * @augments CardLogic
 */
export class Game extends CardLogic {
  /**
   * The game data.
   *
   * @param {number} winner - A number corresponding to a winner.
   */
  constructor (winner) {
    super()
    this._players = []
    this._deck = []
    this._deckUsed = []
    this._numberOfPlayers = 0
    this._winner = winner
  }

  /**
   * A method that handles rules.
   *
   * @function playerDealerRules
   * @param {number} playerIndex - A number corresponding to a player or dealer index in the players array.
   * @param {number} thePlayer - A number corresponding to a player index in the players array.
   */
  playerDealerRules (playerIndex, thePlayer) {
    if (this._players[playerIndex].totVal === 21) {
      this._winner = playerIndex
    } else if (this._players[playerIndex].hand.length === 5 && this._players[playerIndex].totVal < 21) {
      this._winner = playerIndex
    } else if (this._players[playerIndex].totVal > 21) {
      if (playerIndex > 0) {
        this._winner = 0 // Dealer win
      } else {
        this._winner = 1 // player win (could be any number higher than 0)
      }
    } else if (this._players[0].totVal === 0 && this._players[playerIndex].totVal < 21) {
      this.startDealer(playerIndex)
    } else if (this._players[0].totVal < 21 && this._players[0].totVal >= this._players[thePlayer].totVal) {
      this._winner = 0
    } else if (this._players[0].totVal < 21 && this._players[0].totVal < this._players[thePlayer].totVal) {
      this._winner = thePlayer
    } else { // If a rule is forgotten.
      process.exitCode = 1
      throw new Error('The result has no rule!')
    }
  }

  /**
   * A method preparing the game.
   *
   * @function gameSetup
   */
  gameSetup () {
    this._deck = Deck.create()
    Deck.shuffle(this._deck)

    // Number of Players
    if (process.argv[2] === undefined) {
      this._numberOfPlayers = 3
    } else if ((process.argv[2] > 0 && process.argv[2] < 8) || process.argv[2] === '20' || process.argv[2] === '50') {
      this._numberOfPlayers = process.argv[2]
    } else {
      process.exitCode = 26
      throw new Error('The passed argument is not between 1-7, 20 or 50!')
    }

    this._players.push(new Player('Dealer   : '))

    // create players + gives first card
    for (let i = 0; i <= this._numberOfPlayers - 1; i++) {
      const PlayerNumber = i + 1
      const createPlayerName = 'Player #' + PlayerNumber + ': '
      this._players.push(new Player(createPlayerName))
      this._players[PlayerNumber].hand = this._deck.splice(0, 1) // does not add sum to players totVal until player get second card.
    }
  }

  /**
   * A method where the dealer plays a round.
   *
   * @function startDealer
   * @param {number} playerId - The players index in this.players the dealer plays against.
   */
  startDealer (playerId) {
    this.dealerPlayerNewCard(0, 17) // Dealer round
    this.playerDealerRules(0, playerId) // 0 = dealer, playerId = player
  }

  /**
   * A method playing a round with one player.
   *
   * @function gameRound
   * @param {number} playerId - The index of the player playing a round.
   */
  gameRound (playerId) {
    this.dealerPlayerNewCard(playerId, 12) // Player take new cards until max value is reached.
    this.playerDealerRules(playerId) // Decides if player won or dealer is going to play
    Result.results(this._winner, this._players[playerId], this._players[0], this._players[0].hand.length)

    this._deckUsed = this._deckUsed.concat(this._players[0].hand.concat(this._players[0].hand.splice(0, this._players[0].hand.length))) // Dealer hand moves to deckUsed.

    this._deckUsed = this._deckUsed.concat(this._players[playerId].hand.concat(this._players[playerId].hand.splice(0, this._players[playerId].hand.length))) // Player hand moves to deckUsed.

    // Resets player and dealer totVal.
    this.sumCards(0)
    this.sumCards(playerId)
  }

  /**
   * A method starting game setup and then playing a round with each player.
   *
   * @function startGame
   */
  startGame () {
    this.gameSetup() // Prepares game.

    const numOfPlayers = this._numberOfPlayers
    for (let i = 0; i <= numOfPlayers - 1; i++) { // Plays one round with each player.
      const playersindex = i + 1 // Skips dealer at index 0
      this.gameRound(playersindex)
    }
  }
}

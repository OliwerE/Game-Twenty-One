/**
 * Module for Game
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */
import { Deck } from './Deck.js'
import { CreatePlayer } from './CreatePlayer.js'
import { CardLogic } from './CardLogic.js'

/**
 * Represents the game twenty one
 *
 * @class
 */
export class Game extends CardLogic {
  /**
   * The game data.
   *
   * @param {Array} players - The players stored in an array.
   * @param {Array} deck - The deck used to give players new cards.
   * @param {Array} deckUsed - An array containing used cards.
   * @param {number} numberOfPlayers - The amount of players in the current game.
   * @param {number} winner - A number corresponding to a winner.
   */
  constructor (players, deck, deckUsed, numberOfPlayers, winner) {
    super()
    this.players = []
    this.deck = []
    this.deckUsed = []
    this.numberOfPlayers = 0
    this.winner = winner
  }

  /**
   * A method that handles rules.
   *
   * @function playerDealerRules
   * @param {number} playerIndex - A number corresponding to a player or dealer index in the players array.
   * @param {number} thePlayer - A number corresponding to a player index in the players array.
   */
  playerDealerRules (playerIndex, thePlayer) {
    if (this.players[playerIndex].totVal === 21) {
      this.winner = playerIndex
    } else if (this.players[playerIndex].hand.length === 5 && this.players[playerIndex].totVal < 21) {
      this.winner = playerIndex
    } else if (this.players[playerIndex].totVal > 21) {
      if (playerIndex > 0) {
        this.winner = 0 // Dealer win
      } else {
        this.winner = 1 // player win (could be any number higher than 0)
      }
    } else if (this.players[0].totVal === 0 && this.players[playerIndex].totVal < 21) {
      this.startDealer(playerIndex)
    } else if (this.players[0].totVal < 21 && this.players[0].totVal >= this.players[thePlayer].totVal) {
      this.winner = 0
    } else if (this.players[0].totVal < 21 && this.players[0].totVal < this.players[thePlayer].totVal) {
      this.winner = thePlayer
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
    this.deck = Deck.create()
    Deck.shuffle(this.deck)

    // Number of Players
    if (process.argv[2] === undefined) {
      this.numberOfPlayers = 3
    } else if ((process.argv[2] > 0 && process.argv[2] < 8) || process.argv[2] === '20' || process.argv[2] === '50') {
      this.numberOfPlayers = process.argv[2]
    } else {
      process.exitCode = 26
      throw new Error('The passed argument is not between 1-7, 20 or 50!')
    }

    this.players.push(new CreatePlayer('Dealer   : '))

    // create players + gives first card
    for (let i = 0; i <= this.numberOfPlayers - 1; i++) {
      const PlayerNumber = i + 1
      const createPlayerName = 'Player #' + PlayerNumber + ': '
      this.players.push(new CreatePlayer(createPlayerName))
      this.players[PlayerNumber].hand = this.deck.splice(0, 1)
      this.sumCards(i)
    }
  }

  /**
   * A method where the dealer plays a round.
   *
   * @function startDealer
   * @param {number} playerId - The players index in this.players the dealer plays against.
   */
  startDealer (playerId) {
    if (this.deck.length === 1) {
      this.reShuffleCards() // Moves cards back to deck if one left.
    }
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
    this.dealerPlayerNewCard(playerId, 14) // Player take new cards until max value is reached.
    this.playerDealerRules(playerId) // Decides if player won or dealer is going to play
    this.results(playerId)

    this.deckUsed = this.deckUsed.concat(this.players[0].hand.concat(this.players[0].hand.splice(0, this.players[0].hand.length))) // Dealer hand moves to deckUsed.

    this.deckUsed = this.deckUsed.concat(this.players[playerId].hand.concat(this.players[playerId].hand.splice(0, this.players[playerId].hand.length))) // Player hand moves to deckUsed.

    // Resets player and dealer totVal.
    this.sumCards(0)
    this.sumCards(playerId)
  }

  /**
   * A method displaying results to the user.
   *
   * @function results
   * @param {number} playerId - The index of player. Used to show name, hand & total value.
   */
  results (playerId) {
    var bustedPlayer = ''
    var bustedDealer = ''
    var winnerText = ''

    if (this.winner > 0) { // If winner is a player.
      bustedDealer = 'BUSTED!'
      winnerText = 'Player wins!'
    } else if (this.winner === 0) { // if winner is the dealer.
      bustedPlayer = 'BUSTED!'
      winnerText = 'Dealer wins!'
    } else {
      process.exitCode = 1
      throw new Error('this.winner is less than 0, Something went wrong!')
    }

    if (this.players[0].hand.length === 0) {
      console.log(`${this.players[playerId]} ${bustedPlayer}\nDealer   :  - ${bustedDealer}\n${winnerText}\n`)
    } else {
      console.log(`${this.players[playerId]} ${bustedPlayer}\n${this.players[0]} ${bustedDealer}\n${winnerText}\n`)
    }
  }

  /**
   * A method starting game setup and then playing a round with each player.
   *
   * @function startGame
   */
  startGame () {
    this.gameSetup() // Prepares game.

    const numOfPlayers = this.numberOfPlayers
    for (let i = 0; i <= numOfPlayers - 1; i++) { // Plays one round with each player.
      const playersindex = i + 1 // Skips dealer at index 0
      this.gameRound(playersindex)
    }
  }
}

/**
 * Module for Game
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */
import { Deck } from './Deck.js'
import { CreatePlayer } from './CreatePlayer.js'

/**
 * Represents the game twenty one
 *
 * @class
 */
export class CreateGame {
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
    this.players = []
    this.deck = []
    this.deckUsed = []
    this.numberOfPlayers = 0
    this.winner = winner
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

    this.players.push(new CreatePlayer('Dealer   :'))

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
   * A method moving used cards to deck and shuffles again when deck is empty.
   *
   * @function reShuffleCards
   */
  reShuffleCards () {
    const lengthOfUsedDeck = this.deckUsed.length
    var tempReturnCardsToDeck = this.deckUsed.concat(this.deckUsed.splice(0, lengthOfUsedDeck))
    this.deck = this.deck.concat(tempReturnCardsToDeck)
    tempReturnCardsToDeck = []
    if (this.deck.length < 2) {
      process.exitCode = 1 // Övrigt fel, kortleken räcker inte till antalet spelare
      throw new Error('Too many players, the amount of cards are not enough')
    }
    Deck.shuffle(this.deck)
  }

  /**
   * A method deciding if ace should be worth 1 or 14.
   *
   * @function aceCheck
   * @param {number} playerId - A number corresponding to a player index in the players array.
   */
  aceCheck (playerId) {
    var aceCount = 0
    for (let i = 0; i < this.players[playerId].hand.length; i++) {
      aceCount = 0
      for (let i = 0; i < this.players[playerId].hand.length; i++) {
        if (this.players[playerId].hand[i].rank === 1) {
          aceCount += 1
        }
      }
    }
    var extraAceValue = 13 * aceCount
    var altTotVal = this.players[playerId].totVal + extraAceValue
    if (aceCount > 0 && this.players[playerId].totVal < 21) {
      if ((this.players[playerId].totVal + extraAceValue) <= 21) {
        this.players[playerId].totVal = altTotVal
      }
    }
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
        this.winner = 1 // player win
      }
    } else if (this.players[0].totVal === 0 && this.players[playerIndex].totVal < 21) {
      this.startDealer(playerIndex)
    } else if (this.players[0].totVal < 21 && this.players[0].totVal >= this.players[thePlayer].totVal) {
      this.winner = 0
    } else if (this.players[0].totVal < 21 && this.players[0].totVal < this.players[thePlayer].totVal) {
      this.winner = thePlayer
    } else { // If a rule is forgotten.
      process.exitCode = 1
      throw new Error('The outcome has no rule!')
    }
  }

  /**
   * A method that sums cards in the players or dealers hand.
   *
   * @function sumCards
   * @param {number} playerId - A number corresponding to a player or dealer index in the players array.
   */
  sumCards (playerId) {
    const handLength = this.players[playerId].hand.length // Length of playerId hand
    let newTotVal = 0
    for (let a = 0; a <= handLength - 1; a++) { // Sum cards
      newTotVal = newTotVal + this.players[playerId].hand[a].rank
    }
    this.players[playerId].totVal = newTotVal
  }

  /**
   * A method that gives player or dealer new card or cards.
   *
   * @function dealerPlayerNewCard
   * @param {number} playerId - A number corresponding to a player or dealer index in the players array.
   * @param {number} maxtotVal - A total value when the dealer or player stops taking more cards.
   */
  dealerPlayerNewCard (playerId, maxtotVal) {
    this.aceCheck(playerId) // Decides ace value.

    if (this.players[playerId].totVal < maxtotVal) {
      for (let i = 0; this.players[playerId].totVal < maxtotVal; i++) {
        if (this.deck.length === 1) {
          this.reShuffleCards() // Moves cards back to deck and shuffles.
        } else if (this.deck.length === 0) {
          process.exitCode = 27
          throw new Error('deck is empty')
        } else {
          if (this.players[playerId].hand.length === 5) {
            break
          }
          this.players[playerId].hand = this.players[playerId].hand.concat(this.deck.splice(0, 1))
          this.sumCards(playerId)
        }
        this.aceCheck(playerId)
      }
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
    this.players[0].hand = this.deck.splice(0, 1)
    this.sumCards(0)
    this.aceCheck(0)
    this.dealerPlayerNewCard(0, 17) // Dealer round
    this.playerDealerRules(0, playerId) // 0 = dealer, playerId = player
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

    if (this.winner > 0) {
      bustedDealer = 'BUSTED!'
      winnerText = 'Player wins!'
    } else if (this.winner === 0) {
      bustedPlayer = 'BUSTED!'
      winnerText = 'Dealer wins!'
    } else {
      process.exitCode = 1
      throw new Error('this.winner is less than 0, Something went wrong!')
    }

    if (this.players[0].hand.length === 0) {
      console.log(`${this.players[playerId]} ${bustedPlayer}\nDealer   : - ${bustedDealer}\n${winnerText}\n`)
    } else {
      console.log(`${this.players[playerId]} ${bustedPlayer}\n${this.players[0]} ${bustedDealer}\n${winnerText}\n`)
    }
  }

  /**
   * A method playing a round with one player.
   *
   * @function gameRound
   * @param {number} playerId - The index of the player playing a round.
   */
  gameRound (playerId) {
    if (this.deck.length === 1) {
      this.reShuffleCards()
    } else {
      this.players[playerId].hand = this.players[playerId].hand.concat(this.deck.splice(0, 1)) // Player get second setup card
    }
    this.sumCards(playerId)

    if (this.players[playerId].totVal === 21) {
      this.winner = 'player'
    }

    this.dealerPlayerNewCard(playerId, 14) // Player take new cards until max value is reached.
    this.playerDealerRules(playerId) // Decides if player won or dealer is going to play
    this.results(playerId)

    this.deckUsed = this.deckUsed.concat(this.players[0].hand.concat(this.players[0].hand.splice(0, this.players[0].hand.length))) // Dealer hand moves to used deck.

    this.deckUsed = this.deckUsed.concat(this.players[playerId].hand.concat(this.players[playerId].hand.splice(0, this.players[playerId].hand.length))) // Player hand moves to used deck.

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

    const numOfPlayers = this.numberOfPlayers
    for (let i = 0; i <= numOfPlayers - 1; i++) { // Plays one round with each player.
      const j = i + 1
      this.gameRound(j)
    }
  }
}

/**
 * Module for Game
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */
import { Deck } from './Deck.js'
import { PlayingCard } from './PlayingCard.js'
import { CreatePlayer } from './CreatePlayer.js'

//Setup Game:

export class CreateGame {
  constructor () {
    this.players = []
    this.deck = []
    this.deckUsed = []
  }
  gameSetup () {
    this.deck = Deck.create() //skapar kortleken
    // ...shuffle cards 
    //Deck.shuffle(this.deck) //använd sen
    
    // return this.deck  //debug, visar hela kortleken

    //create players
    const numOfPlayers = 2 //ta bort hårdkodning!

    for (let i = 0; i <= numOfPlayers - 1; i++) { // skapar spelarna (ej dealer)
      let createPlayerNumber = i + 1
      this.players.push(new CreatePlayer('Player #' + createPlayerNumber + ': '))
    }

    console.table(this.players) // debug listar spelarna!!

    // gives all players one card:



  }
  toString () {
    return `Spelarna i denna omgång är ( ${this.players} ), Kortleken har dessa kort ( ${this.deck} ), de använda korten är ( ${this.deckUsed} ).`
  }
}

//Begin Game

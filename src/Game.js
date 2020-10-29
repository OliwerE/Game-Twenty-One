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

    //create players + gives first card
    const numOfPlayers = 2 //ta bort hårdkodning!

    for (let i = 0; i <= numOfPlayers - 1; i++) { // skapar spelarna (ej dealer)
      
      // creates player
      let createPlayerNumber = i + 1
      let createPlayerName = 'Player #' + createPlayerNumber + ': '
      this.players.push(new CreatePlayer(createPlayerName))
      
      //gives all players three cards
      this.players[i].hand = this.deck.splice(0, 3) // ger spelaren tre kort (ska egentligen börja med 1!!)
      

      //sum cards
      let handLenght = this.players[i].hand.length
      for (let a = 0; a <= handLenght - 1 ; a++) { // Summerar de första korten
        this.players[i].totVal = this.players[i].totVal + this.players[i].hand[a].rank
      }
    }

    console.table(this.players) // debug listar spelarna

    // gives all players one card:



  }
  toString () {
    return `Spelarna i denna omgång är ( ${this.players} ), Kortleken har dessa kort ( ${this.deck} ), de använda korten är ( ${this.deckUsed} ).`
  }
}

//Begin Game

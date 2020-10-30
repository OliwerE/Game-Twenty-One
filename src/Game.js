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
    this.numberOfPlayers = 0
  }
  gameSetup () {
    this.deck = Deck.create() //skapar kortleken
    // ...shuffle cards 
    //Deck.shuffle(this.deck) //använd sen
    
    // return this.deck  //debug, visar hela kortleken

    //create players + gives first card
    this.numberOfPlayers = 1 //ta bort hårdkodning!
    const numOfPlayers = this.numberOfPlayers

    for (let i = 0; i <= numOfPlayers - 1; i++) { // skapar spelarna och summerar (ej dealer)
      
      // creates player
      let createPlayerNumber = i + 1
      let createPlayerName = 'Player #' + createPlayerNumber + ': '
      this.players.push(new CreatePlayer(createPlayerName))
      
      //gives all players first card
      this.players[i].hand = this.deck.splice(0, 1) // ger spelaren första kortet
      

      //sum cards
      let handLenght = this.players[i].hand.length
      for (let a = 0; a <= handLenght - 1 ; a++) { // Summerar de första korten (behöver ingen loop för att summera ett kort!!)
        this.players[i].totVal = this.players[i].totVal + this.players[i].hand[a].rank
      }
    }
    console.table(this.players) // debug listar spelarna

    //console.table(this.players[0]) //spelare 1
  }
  gameRound (playerIndex) { //spelar med en spelare
    var playerId = playerIndex
 
    // ger det andra "startkortet"
    var tempHand = this.deck.splice(0, 1)

    //visar temphand ska innehålla ett kort
    //console.table(tempHand)
    
    const fixedHand = this.players[0].hand.concat(tempHand)
    tempHand = []
    this.players[0].hand = fixedHand
    
    console.log('här får spelaren det första (tot andra) kortet för omgången') 
    console.table(this.players)
    
    //visar temphand ska vara tom
    //console.table(tempHand)


    //slut det andra startkortet



  }
  /*toString () {
    return `Spelarna i denna omgång är ( ${this.players} ), Kortleken har dessa kort ( ${this.deck} ), de använda korten är ( ${this.deckUsed} ).`
  }*/
  debugPlayers () {
    return this.players
  }
  /*debugCardsLeft () {
    return this.deck
  }
  debugUsedCards () {
    return this.deckUsed
  }*/
  startGame () {
    //setup
    this.gameSetup()

    //Dealer play with players one at a time
    const numOfPlayers = this.numberOfPlayers
    for (let i = 0; i <= numOfPlayers - 1; i++) {
      this.gameRound(i)
    }
    
  }
}


/* lägger till kort från player index i slänghögen
this.deckUsed = this.players[0].hand.splice(0, 1)
*/

/*
// test skapa metod utanför utanför en klass
CreateGame.prototype.testMethod = function() {
  return 'method outside class'
}
*/

//Begin Game

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
    this.dealer = []
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
    this.numberOfPlayers = 2 //ta bort hårdkodning!
    const numOfPlayers = this.numberOfPlayers

    // creates dealer
    this.dealer.push(new CreatePlayer('Dealer'))

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
    console.log('lista på spelarnas namn, kort och totVal') 
    console.table(this.players) // debug listar spelarna

    //console.table(this.players[0]) //spelare 1
  }
  startDealer (playerId) {
    var playerNumber = playerId + 1
    //dealern förbereds
    console.log('-------------------')
    console.table(this.dealer)
    console.log('dealern börjar spela för spelare nr: ', playerNumber)

    //dealer börjar spela (känner inte till spelarens kort!)




  }
  gameRound (playerIndex) { //spelar med en spelare
    var playerId = playerIndex
 
    // ger det andra "startkortet"
    var tempHand = this.deck.splice(0, 1)

    //visar temphand ska innehålla ett kort
    //console.table(tempHand)
    
    const fixedHand = this.players[playerId].hand.concat(tempHand)
    tempHand = []
    this.players[playerId].hand = fixedHand
    
    //console.log('här får spelaren det första (tot andra) kortet för omgången (summeras ej i totVal!)') //debug
    //console.table(this.players) //debug
    
    //visar temphand ska vara tom
    //console.table(tempHand)

    //sum cards, SKAPA EN METOD SOM SUMMERAR KORT!!
    let handLenght = this.players[playerId].hand.length //returns 2
    //console.log('handens längd: ', handLenght)
    let newPlayerTotVal = 0
    for (let a = 0; a <= handLenght - 1 ; a++) { // summerar korten i handen
      newPlayerTotVal = newPlayerTotVal + this.players[playerId].hand[a].rank
    }
    this.players[playerId].totVal = newPlayerTotVal

    //console.log(this.players[0].totVal)

    console.log('Spelare', playerId + 1, 'är redo att börja spela')
    console.table(this.players) // kontrollera att summan stämmer för player1
    //slut det andra startkortet

    // spelarens val
    console.log('Börjar spela:')

    if (this.players[playerId].totVal === 21) {
      console.log('Player win!') // om vinst slutar rundan här!
    }


    for (let i = 0; this.players[playerId].totVal <= 17; i++) { //när spelarens summa är mindre än 17
      console.log('Tar ett nytt kort', i + 1) // debug
        
      //lägger till kort i spelarens hand
      this.players[playerId].hand = this.players[playerId].hand.concat(this.deck.splice(0, 1))
        
      //Summerar korten (upprepning...)

      let handLenght2 = this.players[playerId].hand.length //returns 2
      //console.log('handens längd2: ', handLenght2) //debug
      let newPlayerTotVal2 = 0
      for (let a = 0; a <= handLenght2 - 1 ; a++) { // summerar korten i handen
        newPlayerTotVal2 = newPlayerTotVal2 + this.players[playerId].hand[a].rank
      }
      this.players[playerId].totVal = newPlayerTotVal2

      //debug skriver ut
      //this.players[0].totVal = 18 //test
      //console.table('nya totVal:') //debug
      //console.table(this.players) //debug
    }

    console.table(this.players) //debug

    if (this.players[playerId].totVal === 21) { //UPPREPAD KOD!!
      console.log('Player win!')
    } else if (this.players[playerId].totVal < 21) {
      console.log('GIVENS TUR!')
      this.startDealer(playerId)
    } else if (this.players[playerId].totVal > 21) {
      console.log('Dealer Win!')
    }
    
    
    console.log('program temp slutar')
    console.log('-----------------------')

    //slut spelarens val

    //console.log(this.players) //debug visar spelarna

    //Lägg kort i slänghög


    // slut lägg kort i slänghög


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

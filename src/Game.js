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
    this.winner = ''
  }
  gameSetup () {
    this.deck = Deck.create() //skapar kortleken
    // ...shuffle cards 
    Deck.shuffle(this.deck) //använd sen
    
    // return this.deck  //debug, visar hela kortleken

    // Number of Players using argument from user

    // console.log(process.argv[2]) // visar användarens argument

    if(process.argv[2] === undefined) { // om spelaren inte ger ett argument
      this.numberOfPlayers = 3
      console.log('är undefined')
    } else if (process.argv[2] > 0 && process.argv[2] < 8) {
      this.numberOfPlayers = process.argv[2]
      console.log('mellan 1 och 7')
    } else if (process.argv[2] == 20 || process.argv[2] == 50) {
      this.numberOfPlayers = process.argv[2]
      console.log('input är 20 eller 50')
    }else {
      process.exitCode = 26// kod 26 för felaktigt antal spelare
      throw new Error('The passed argument is not between 1-7, 20 or 50!')

    }

    const numOfPlayers = this.numberOfPlayers

    // creates dealer
    this.dealer.push(new CreatePlayer('Dealer'))
    
    //create players + gives first card
    for (let i = 0; i <= numOfPlayers - 1; i++) { // skapar spelarna och summerar (ej dealer)

      // creates player
      let createPlayerNumber = i + 1
      let createPlayerName = 'Player #' + createPlayerNumber + ': '
      this.players.push(new CreatePlayer(createPlayerName))
      
      //gives all players first card
      //OBS DETTA  MÅSTE KONTROLLERAS SÅ INTE KORT TAR SLUT!! (egentligen inte eftersom det högst kan vara 50 spelare..)
      this.players[i].hand = this.deck.splice(0, 1) // ger spelaren första kortet
      

      //sum cards
      let handLenght = this.players[i].hand.length
      for (let a = 0; a <= handLenght - 1 ; a++) { // Summerar de första korten (behöver ingen loop för att summera ett kort!!)
        this.players[i].totVal = this.players[i].totVal + this.players[i].hand[a].rank
      }
    }



    console.log('spelarna')
    console.table(this.players)
    console.table(this.dealer)
    console.log('---------gameSetup()-slut---------------')


  }
  reShuffleCards () {
    console.log('method reShuffleCards starts!')
    const lengthOfUsedDeck = this.deckUsed.length

    var tempReturnCardsToDeck = this.deckUsed.concat(this.deckUsed.splice(0, lengthOfUsedDeck))
    this.deck = this.deck.concat(tempReturnCardsToDeck)
    var tempReturnCardsToDeck = []

    console.log('är deckUsed tom:')
    console.table(this.deckUsed)
    console.log('-----------------------')

    console.log('är deck fylld med 52 kort??:')
    console.table(this.deck)
    console.log('-----------------------')

    Deck.shuffle(this.deck) //blandar korten!

    console.log('deck blandad??:')
    console.table(this.deck)
    console.log('-----------------------')

  /*
    //debug kastar error efter att korten flyttat tbx till draghögen och blandats!
    process.exitCode = 30 // egen exit code ha inte med!
    throw new Error('kontroll om kortflytt är korrekt!') 
  */
    console.log('method reShuffleCards end!')
  }
  testPlayerTotVal (playerId) {

    //testar  om spelarens totVal är 21, vinner om sant
    if (this.players[playerId].totVal === 21) {
      console.log('Player win!')
      this.winner = 'player'
    }

  }
  startDealer (playerId) {
    var playerNumber = playerId + 1
    //dealern förbereds
    console.log('-------------------')
    //console.table(this.dealer)
    console.log('dealern börjar spela för spelare nr: ', playerNumber)

    //något stämmer inte med dealern!
    //dealer börjar spela (känner inte till spelarens kort!)

    //ger dealern första kortet

    if (this.deck.length === 1) { //fungerar inte när använda ska flyttas till deck och blandas igen! hoppar över när deck.length är 1.. !
      
      this.reShuffleCards() //kallar på metoden som flyttar tbx och blandar korten till draghögen
    
      /* debug reShuffleCards
      process.exitCode = 39// kod 26 för felaktigt antal spelare
      throw new Error('kontroll kort tog slut för dealer när den tog första!')
      */

    }

    this.dealer[0].hand = this.deck.splice(0, 1)

    //summerar dealerns kort

    //sum cards
    let dealerHandLength = this.players[playerId].hand.length //returns 2
    //console.log('handens längd2: ', handLenght2) //debug
    let newDealerTotVal = 0
    //console.log(this.dealer[0].hand[0].rank)
    for (let a = 0; a <= dealerHandLength - 1 ; a++) { // summerar korten i handen
      newDealerTotVal = newDealerTotVal + this.dealer[0].hand[0].rank
    }
    this.dealer[0].totVal = dealerHandLength




    //delarn fortsätter spela

    for (let i = 0; this.dealer[0].totVal <= 17; i++) { //när spelarens summa är mindre än 17
      //arbetar med denna if else i gameround slå ihop sen!
      if (this.deck.length === 1) { //denna är buggad när oblandat och 50 spelare!
        
        this.reShuffleCards() //kallar på metoden som flyttar tbx och blandar korten till draghögen      
      
        /* debug reShuffleCards
        process.exitCode = 39// kod 26 för felaktigt antal spelare
        throw new Error('kontroll kort tog slut för dealer när den skulle ta flera!')
        */

        /*
        if (this.deck.length === 1) { //fungerar inte när använda ska flyttas till deck och blandas igen! hoppar över när deck.length är 1.. !
        //this.deck = []
        console.log(this.deck.length)
        console.log('kort i deck if:')
        console.table(this.deck)
        process.exitCode = 30 // egen exit code ha inte med!
        throw new Error('det är endast ett kort i deck!') 
        */

      } else if (this.deck.length === 0) {
        console.log('kort i deck else if:')
        console.table(this.deck)
        process.exitCode = 27// Kod 27 = går inte att dra kort från draghögen!
        throw new Error('deck is empty') 
      } else {
      console.log('Dealer yar ett nytt kort', i + 1)
        
      //lägger till kort i spelarens hand
      this.dealer[0].hand = this.dealer[0].hand.concat(this.deck.splice(0, 1))
        
      //Summerar korten (upprepning...)

      let handLenght2 = this.dealer[0].hand.length //returns 2
      //console.log('handens längd2: ', handLenght2) //debug
      let newPlayerTotVal2 = 0
      for (let a = 0; a <= handLenght2 - 1 ; a++) { // summerar korten i handen
        newPlayerTotVal2 = newPlayerTotVal2 + this.dealer[0].hand[a].rank
      }
      this.dealer[0].totVal = newPlayerTotVal2

      //debug skriver ut
      //this.players[0].totVal = 18 //test
      //console.table('nya totVal:') //debug
      //console.table(this.players) //debug
    }
    }

    console.table(this.dealer) //debug
    console.log(this.dealer[0].hand) // debug korten
    //console.log(this.dealer[0].hand)//dealerns hand

    //dealern räknar ut vem som vann:

    //console.log('dealerns totval: ', this.dealer[0].totVal) //debug

  
    const playerSum = this.players[0].totVal
    const dealerSum = this.dealer[0].totVal
  
    if (this.dealer[0].totVal > 21) {
      console.log('dealer Lost! Player Won!') //funkar!
    } else if (dealerSum > playerSum) { //player index hårdkodat importera [i] !!
      console.log('dealer won! Player Lost!') // funkar
    } else if (playerSum > dealerSum) { 
      console.log('player won! Dealer lost!') // funkar!!
    } else {
      console.log('något kanske är fel! kolla upp startDealer metod!') //fixa!! kommer hit om båda får samma totVal!
    }

    //dealerns hand flyttas till slänghögen

    console.log('--------------------------------------')

    if (this.dealer[0].hand.length <= 1) { //om spelaren har ett kort i handen
      console.log('DEBUG: spelaren har en hand med längden 1 eller lägre')
      var deckUsedOneCard = this.dealer[0].hand.concat(this.dealer[0].hand.splice(0, 1))
      this.deckUsed = this.deckUsed.concat(deckUsedOneCard)
      var deckUsedOneCard = []
    } else { // om spelaren har 2 eller fler kort i handen!
      console.log ('DEBUG: spelarens hand är 2 eller längre!')
      const lengthOfPlayersHand = this.dealer[0].hand.length

      var multipleUsedCards = this.dealer[0].hand.concat(this.dealer[0].hand.splice(0, lengthOfPlayersHand))
      this.deckUsed = this.deckUsed.concat(multipleUsedCards)
      var multipleUsedCards = []
    }


    console.log('----------------------------------')

    //gamla slänghögen:
    /*
    const numberOfDealerCards = this.dealer[0].hand.length //antalet kort dealern har i handen
    this.deckUsed = this.deckUsed + this.dealer[0].hand.concat(this.dealer[0].hand.splice(0, numberOfDealerCards)) //korten flyttas till slänghögen
*/
    console.log('dealerns tomma hand:')
    console.log(this.dealer[0].hand) //debug om spelarens hand är tom
    console.log('dealerns kort flyttas till slänghögen')
    //console.table(this.deckUsed) //debug om korten är i slänghögen


    console.log('här slutar dealern!')
  }
  results (playerId) { //Skriver ut omgångens resultat
    console.log('-------------------------')
    console.log('Resultat (det som ska visas för användaren):')

    var bustedPlayer = ''
    var bustedDealer = ''

    //Vem som är förlorare, fixa!!
    if (this.winner === 'player') {
      bustedDealer = 'BUSTED!'
    } else if (this.winner === 'dealer') {
      bustedPlayer = 'BUSTED!'
    }

    console.log(`${this.players[playerId]}`, bustedPlayer)
    console.log(`${this.dealer[0]}`, bustedDealer) // behöver antagligen skrivas på annat sätt!


    console.log('-------------------------')
  }
  gameRound (playerIndex) { //spelar med en spelare
    var playerId = playerIndex
    
    
    if (this.deck.length === 1) { //fungerar inte när använda ska flyttas till deck och blandas igen! hoppar över när deck.length är 1.. !
      
      this.reShuffleCards() //kallar på metoden som flyttar tbx och blandar korten till draghögen

      /*
      const lengthOfUsedDeck = this.deckUsed.length

        var tempReturnCardsToDeck = this.deckUsed.concat(this.deckUsed.splice(0, lengthOfUsedDeck))
        this.deck = this.deck.concat(tempReturnCardsToDeck)
        var tempReturnCardsToDeck = []

        console.log('är deckUsed tom:')
        console.table(this.deckUsed)
        console.log('-----------------------')

        console.log('är deck fylld med 52 kort??:')
        console.table(this.deck)
        console.log('-----------------------')

        Deck.shuffle(this.deck) //blandar korten!

        console.log('deck blandad??:')
        console.table(this.deck)
        console.log('-----------------------')
      */
      /*
        //debug kastar error efter att korten flyttat tbx till draghögen och blandats!
        process.exitCode = 30 // egen exit code ha inte med!
        throw new Error('kontroll om kortflytt är korrekt!') 
      */

      
      /*//this.deck = []
      console.log(this.deck.length)
      console.log('kort i deck if:')
      console.table(this.deck)
      process.exitCode = 30 // egen exit code ha inte med!
      throw new Error('det är endast ett kort i deck!') 
      */
    } else {
      // ger det andra "startkortet"
      this.players[playerId].hand = this.players[playerId].hand.concat(this.deck.splice(0, 1))
    }

    //sum cards, SKAPA EN METOD SOM SUMMERAR KORT!!
    let handLenght = this.players[playerId].hand.length //returns 2
    //console.log('handens längd: ', handLenght)
    let newPlayerTotVal = 0
    for (let a = 0; a <= handLenght - 1 ; a++) { // summerar korten i handen
      newPlayerTotVal = newPlayerTotVal + this.players[playerId].hand[a].rank
    }
    this.players[playerId].totVal = newPlayerTotVal

    console.log('Spelare', playerId + 1, 'är redo att börja spela')
    console.table(this.players) // kontrollera att summan stämmer för player1
    //slut det andra startkortet

    // spelarens val
    console.log('Börjar spela:')

    this.testPlayerTotVal(playerId) //testar om spelarens två "startkort" är 21
    
    console.log('--------------')
    console.log(this.players[playerId].hand)
    console.log('--------------')


    for (let i = 0; this.players[playerId].totVal <= 15; i++) { //när spelarens summa är mindre än 15
      console.log('draghögens längd: ', this.deck.length)
      if (this.deck.length === 1) { //denna är buggad när oblandat och 50 spelare!
        
        this.reShuffleCards() //kallar på metoden som flyttar tbx och blandar korten till draghögen

        /*
        const lengthOfUsedDeck = this.deckUsed.length

        var tempReturnCardsToDeck = this.deckUsed.concat(this.deckUsed.splice(0, lengthOfUsedDeck))
        this.deck = this.deck.concat(tempReturnCardsToDeck)
        var tempReturnCardsToDeck = []

        console.log('är deckUsed tom:')
        console.table(this.deckUsed)
        console.log('-----------------------')

        console.log('är deck fylld med 52 kort??:')
        console.table(this.deck)
        console.log('-----------------------')
        */

        /* kontroll/debug
        process.exitCode = 38 // egen exit code ha inte med!
        throw new Error('kontroll om kortflytt är korrekt!') 
        */
        
        /*
        //this.deck = []
        console.log(this.deck.length)
        console.log('kort i deck if:')
        console.table(this.deck)
        process.exitCode = 31 // egen exit code ha inte med!
        throw new Error('det är endast ett kort i deck!')
        */
        
      } else if (this.deck.length === 0) {
        console.log('kort i deck else if:')
        console.table(this.deck)
        process.exitCode = 27// Kod 27 = går inte att dra kort från draghögen!
        throw new Error('deck is empty') 
      } else {

      if (this.players[playerId].hand.length == 5) { // bryter loopen om spelaren har 5 kort längre ner kommer villkor som gör att spelaren vinner om den har 5 kort och mindre än 21!
        break
      }
      console.log('Tar ett nytt kort', i + 1) // debug

      //om summan är mindre än 21 och handens längd är 5
      /*const loopHand = this.players[playerId].hand

      if (loopHand.length == 5) { // && this.players[playerId].totVal >= 21
        console.log('spelaren har fem kort som är mindre än 21 och vinner rundan!')
        this.winner = 'player'
      }*/


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
    }

    console.table(this.players) //debug

    this.testPlayerTotVal(playerId) //används mer sen! ta bort if else if satsen nedan och flytta till metoden!

    if (this.players[playerId].hand.length == 5 && this.players[playerId].totVal < 21) { // 5 kort och sum mindre än 21 (testad fungerar!)
      console.log('Player Win! 5 kort & mindre än 21!')
      this.winner = 'player'
    } else if (this.players[playerId].totVal < 21) { //kan inte flyttas till testPlayerTotVal!
      console.log('GIVENS TUR!')
      var idPlayer = playerId
      this.startDealer(idPlayer)
    } else if (this.players[playerId].totVal > 21) {
      console.log('Dealer Win!')
      this.winner = 'dealer'
    }
    /*
    if (this.players[playerId].totVal === 21) { //UPPREPAD KOD!!
      console.log('Player win!')
      this.winner = 'player'
    } else */
    

    
    //console.log(`${this.debugPlayers()}`) //spelarens kort innan slänghögen!

    //resultat
    this.results(playerId) // metod som skriver ut omgångens resultat


    // Spelarens hand flyttas till slänghögen

    console.log('--------------------------------------')

    if (this.players[playerId].hand.length <= 1) { //om spelaren har ett kort i handen
      console.log('DEBUG: spelaren har en hand med längden 1 eller lägre')
      var deckUsedOneCard = this.players[playerId].hand.concat(this.players[playerId].hand.splice(0, 1))
      this.deckUsed = this.deckUsed.concat(deckUsedOneCard)
      var deckUsedOneCard = []
    } else { // om spelaren har 2 eller fler kort i handen! STÅR SAMMA SAK! behöver inte if else??
      console.log ('DEBUG: spelarens hand är 2 eller längre!')
      const lengthOfPlayersHand = this.players[playerId].hand.length

      var multipleUsedCards = this.players[playerId].hand.concat(this.players[playerId].hand.splice(0, lengthOfPlayersHand))
      this.deckUsed = this.deckUsed.concat(multipleUsedCards)
      var multipleUsedCards = []
    }


    console.log('----------------------------------')

    //Använd när buggen i slänghögen felsöks!
    console.log('spelarens kort flyttas till slänghögen:')
    console.table(this.deckUsed) //debug både dealern och playerns kort ska finnas i deck used!
    console.log('--------------------------------')
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
    for (let i = 0; i <= numOfPlayers - 1; i++) { // BUGG spelet krashar över 10 spelare!!
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

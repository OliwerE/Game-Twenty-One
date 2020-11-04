/**
 * Module for Game
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */
import { Deck } from './Deck.js'
import { PlayingCard } from './PlayingCard.js'
import { CreatePlayer } from './CreatePlayer.js'

// Setup Game:

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
    // Creates Deck
    //this.deck = Deck.create() // skapar kortleken

    // ...shuffle cards
    Deck.shuffle(this.deck) // använd sen

    // Number of Players using argument from user
    if (process.argv[2] === undefined) { // om spelaren inte ger ett argument
      this.numberOfPlayers = 3
      console.log('är undefined')
    } else if (process.argv[2] > 0 && process.argv[2] < 8) {
      this.numberOfPlayers = process.argv[2]
      console.log('mellan 1 och 7')
    } else if (process.argv[2] === '20' || process.argv[2] === '50') { // göra om input till number?
      this.numberOfPlayers = process.argv[2]
      console.log('input är 20 eller 50')
    } else {
      process.exitCode = 26// kod 26 för felaktigt antal spelare
      throw new Error('The passed argument is not between 1-7, 20 or 50!')
    }

    const numOfPlayers = this.numberOfPlayers

    // creates dealer
    this.players.push(new CreatePlayer('Dealer'))

    console.log('syns detta')

    // create players + gives first card
    for (let i = 0; i <= numOfPlayers - 1; i++) { // skapar spelarna och summerar (ej dealer)
      // creates player
      const PlayerNumber = i + 1
      const createPlayerName = 'Player #' + PlayerNumber + ': '
      this.players.push(new CreatePlayer(createPlayerName))

      // gives all players first card
      // OBS DETTA  MÅSTE KONTROLLERAS SÅ INTE KORT TAR SLUT!! (egentligen inte eftersom det högst kan vara 50 spelare..)
      this.players[PlayerNumber].hand = this.deck.splice(0, 1) // ger spelaren första kortet

      // sum cards
      const handLenght = this.players[i].hand.length
      for (let a = 0; a <= handLenght - 1; a++) { // Summerar de första korten (behöver ingen loop för att summera ett kort!!)
        this.players[PlayerNumber].totVal = this.players[PlayerNumber].totVal + this.players[PlayerNumber].hand[a].rank
      }
    }

    console.log('spelarna')
    console.table(this.players)
    console.table(this.dealer)
    console.log('---------gameSetup()-slut---------------')
  }

  reShuffleCards () {
    console.log('method reShuffleCards starts!')

    
    //debug
    console.log('kortleken har 1 kort??')
    console.table(this.deck)
    
    console.log('kort i deck used:')
    console.table(this.deckUsed)





    const lengthOfUsedDeck = this.deckUsed.length

    var tempReturnCardsToDeck = this.deckUsed.concat(this.deckUsed.splice(0, lengthOfUsedDeck))
    this.deck = this.deck.concat(tempReturnCardsToDeck)
    var tempReturnCardsToDeck = []

    //debug
    console.log('deckused tom?')
    console.table(this.deckUsed)
    console.log('deck fylld?')
    console.table(this.deck)



    if (this.deck.length < 2) {
      process.exitCode = 1 // Övrigt fel, kortleken räcker inte till antalet spelare
      throw new Error('Too many players, the amount of cards are not enough')
    }

    //blandar korten
    Deck.shuffle(this.deck)

    //debug
    console.log('deck blandad?')
    console.table(this.deck)
    //process.exitCode = 96 // Övrigt fel, kortleken räcker inte till antalet spelare
    //throw new Error('test')

    console.log('method reShuffleCards end!')
  }
  testPlayerTotVal (playerId) {
    
    //testar  om spelarens totVal är 21, vinner om sant
    if (this.players[playerId].totVal === 21) {
      console.log('Player win!')
      this.winner = 'player'
    }
    
    /* bugg, går direkt till dealer!
    // avgör vinnare (player villkor)
    if (this.players[playerId].totVal === 21 && this.players[playerId].hand.length <= 5) { // om spelarens hand är 21 och handens länd är lika eller mindre än 5
      console.log('spelaren vinner, har exakt 21 och mindre än 5 kort')
      this.winner = 'player'
    } else if (this.players[playerId].totVal < 21 && this.players[playerId].hand.length === 5) { // om totala värdet är mindre än 21 och har exakt 5 kort
      console.log('spelare vinner, har 5 kort och är fortfarande under 21 wow')
      this.winner = 'player'
    } else if (this.players[playerId].totVal < 21) { // när spelaren stannar under 21 (när given ska spela!)
      console.log('GIVENS TUR!')
      var idPlayer = playerId
      this.startDealer(idPlayer)
    } else if (this.players[playerId].totVal > 21 || this.players[playerId].hand.length > 5 ) { // om summan är över 21 eller handens längd är mer än 5
      console.log('spelare förlorar, har mer än 21 eller fler än 5 kort')
      this.winner = 'dealer'
    }
    */
  }
  sumCards (playerId) {
    
  }
  dealerPlayerNewCard (playerId, maxtotVal) {
    console.log('-------------dealerPlayerNewCard method starts-----------------')
    console.log('spelar max till ', maxtotVal)
    for (let i = 0; this.players[playerId].totVal <= maxtotVal; i++) { // när spelarens summa är mindre än 17
      console.log('draghögens längd: ', this.deck.length)
      if (this.deck.length === 1) { // denna är buggad när oblandat och 50 spelare!
        this.reShuffleCards() // kallar på metoden som flyttar tbx och blandar korten till draghögen
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

        // lägger till kort i spelarens hand
        this.players[playerId].hand = this.players[playerId].hand.concat(this.deck.splice(0, 1))

        // Summerar korten (upprepning...)

        const handLenght2 = this.players[playerId].hand.length // returns 2
        // console.log('handens längd2: ', handLenght2) //debug
        let newPlayerTotVal2 = 0
        for (let a = 0; a <= handLenght2 - 1; a++) { // summerar korten i handen
          newPlayerTotVal2 = newPlayerTotVal2 + this.players[playerId].hand[a].rank
        }
        this.players[playerId].totVal = newPlayerTotVal2
      }
    }
    console.log('-----------------dealerPlayerNewCard method ends----------------')
  }
  startDealer (playerId) {
    console.log('---------------dealern börjar spela för spelare nr: ', playerId + 1, '-----------------')
    // ger dealern första kortet
    if (this.deck.length === 1) { // fungerar inte när använda ska flyttas till deck och blandas igen! hoppar över när deck.length är 1.. !
      this.reShuffleCards() // kallar på metoden som flyttar tbx och blandar korten till draghögen
    }
    this.players[0].hand = this.deck.splice(0, 1) //ger första kortet till dealern
    
    // summerar dealerns kort
    const dealerHandLength = this.players[0].hand.length // returns 2
    // console.log('handens längd2: ', handLenght2) //debug
    let newDealerTotVal = 0
    // console.log(this.dealer[0].hand[0].rank)
    for (let a = 0; a <= dealerHandLength - 1; a++) { // summerar korten i handen
      newDealerTotVal = newDealerTotVal + this.players[0].hand[0].rank
    }
    this.players[0].totVal = dealerHandLength

    // delarn fortsätter spela

    this.dealerPlayerNewCard(0, 17) //id 0 (för dealer), spelar så länge totval är under 17

    console.table(this.players) // debug
    console.log(this.players[0].hand) // debug korten


        // dealern räknar ut vem som vann:

        const playerSum = this.players[playerId].totVal
        const dealerSum = this.players[0].totVal

        /*
        console.log('dealer debug: ')
        console.log(playerSum)
        console.log(dealerSum)
        */
    
        if (this.players[0].totVal > 21) {
          console.log('dealer Lost! Player Won!') // funkar!
        } else if (dealerSum > playerSum) { // player index hårdkodat importera [i] !!
          console.log('dealer won! Player Lost!') // funkar
        } else if (playerSum > dealerSum) {
          console.log('player won! Dealer lost!') // funkar!!
        } else {
          console.log('något kanske är fel! kolla upp startDealer metod!!') // fixa!! kommer hit om båda får samma totVal!
        }




    /*
    // dealern räknar ut vem som vann:

    const playerSum = this.players[0].totVal
    const dealerSum = this.dealer[0].totVal

    if (this.dealer[0].totVal > 21) {
      console.log('dealer Lost! Player Won!') // funkar!
    } else if (dealerSum > playerSum) { // player index hårdkodat importera [i] !!
      console.log('dealer won! Player Lost!') // funkar
    } else if (playerSum > dealerSum) {
      console.log('player won! Dealer lost!') // funkar!!
    } else {
      console.log('något kanske är fel! kolla upp startDealer metod!') // fixa!! kommer hit om båda får samma totVal!
    }
*/
    // dealerns hand flyttas till slänghögen

    console.log('--------------------------------------')

    if (this.players[0].hand.length <= 1) { // om dealer har ett kort i handen
      console.log('DEBUG: dealer har en hand med längden 1 eller lägre')
      var deckUsedOneCard = this.players[0].hand.concat(this.players[0].hand.splice(0, 1))
      this.deckUsed = this.deckUsed.concat(deckUsedOneCard)
      var deckUsedOneCard = []
    } else { // om dealer har 2 eller fler kort i handen!
      console.log('DEBUG: dealer hand är 2 eller längre!')
      const lengthOfPlayersHand = this.players[0].hand.length

      var multipleUsedCards = this.players[0].hand.concat(this.players[0].hand.splice(0, lengthOfPlayersHand))
      this.deckUsed = this.deckUsed.concat(multipleUsedCards)
      var multipleUsedCards = []
    }

    console.log('----------------------------------')
    console.log('dealerns tomma hand:')
    console.log(this.players[0].hand) // debug om spelarens hand är tom
    console.log('dealerns kort flyttas till slänghögen')
    console.table(this.deckUsed)
    // console.table(this.deckUsed) //debug om korten är i slänghögen

    console.log('här slutar dealern!')
  }

  results (playerId) { // Skriver ut omgångens resultat
    console.log('-------------------------')
    console.log('Resultat (det som ska visas för användaren):')

    var bustedPlayer = ''
    var bustedDealer = ''

    // Vem som är förlorare, fixa!!
    if (this.winner === 'player') {
      bustedDealer = 'BUSTED!'
    } else if (this.winner === 'dealer') {
      bustedPlayer = 'BUSTED!'
    }

    console.log(`${this.players[playerId]}`, bustedPlayer)
    console.log(`${this.players[0]}`, bustedDealer) // behöver antagligen skrivas på annat sätt!

    console.log('-------------------------')
  }

  gameRound (playerIndex) { // spelar med en spelare
    var playerId = playerIndex

    console.log('spelarid ', playerId)

    if (this.deck.length === 1) { // fungerar inte när använda ska flyttas till deck och blandas igen! hoppar över när deck.length är 1.. !
      this.reShuffleCards() // kallar på metoden som flyttar tbx och blandar korten till draghögen
    } else {
      // ger det andra "startkortet"
      this.players[playerId].hand = this.players[playerId].hand.concat(this.deck.splice(0, 1))
    }

    // sum cards, SKAPA EN METOD SOM SUMMERAR KORT!!
    const handLenght = this.players[playerId].hand.length // returns 2
    // console.log('handens längd: ', handLenght)
    let newPlayerTotVal = 0
    for (let a = 0; a <= handLenght - 1; a++) { // summerar korten i handen
      newPlayerTotVal = newPlayerTotVal + this.players[playerId].hand[a].rank
    }
    this.players[playerId].totVal = newPlayerTotVal

    console.log('Spelare', playerId, 'är redo att börja spela')
    console.table(this.players) // kontrollera att summan stämmer för player1
    // slut det andra startkortet

    // spelarens val
    console.log('Börjar spela:')

    //denna kan inte kombineras, eftersom går direkt till dealer isf!
    //this.testPlayerTotVal(playerId) // testar om spelarens två "startkort" är 21


    this.testPlayerTotVal(playerId) //testar om spelarens två "startkort" är 21


    /* gör samma som ovan rad 300
    if (this.players[playerId].totVal === 21) { // om spelarens hand är 21 vinner den direkt!
      console.log('spelaren fick 21 på andra startkortet!, vinner!!')
      this.winner = 'player'
    }
  */

  //spelaren fortsätter spela
  this.dealerPlayerNewCard(playerId, 14) // skickar spelar index och spelarnas (alla) högsta totval för att ta nytt kort

    console.log('debug spelare: ')
    console.table(this.players) // debug

    //fixa här
    this.testPlayerTotVal(playerId) // testar om spelarens värden är 21 mer sen!

    if (this.players[playerId].hand.length == 5 && this.players[playerId].totVal < 21) { // 5 kort och sum mindre än 21 (testad fungerar!)
      console.log('Player Win! 5 kort & mindre än 21!')
      this.winner = 'player'
    } else if (this.players[playerId].totVal < 21) { //kan inte flyttas till testPlayerTotVal!
      console.log('GIVENS TUR!')
      var idPlayer = playerId
      console.log('debug', idPlayer)
      this.startDealer(idPlayer)
    } else if (this.players[playerId].totVal > 21) {
      console.log('Dealer Win!')
      this.winner = 'dealer'
    }



    // resultat
    this.results(playerId) // metod som skriver ut omgångens resultat

    // Spelarens hand flyttas till slänghögen

    console.log('--------------------------------------')

    if (this.players[playerId].hand.length <= 1) { // om spelaren har ett kort i handen
      console.log('DEBUG: spelaren har en hand med längden 1 eller lägre')
      var deckUsedOneCard = this.players[playerId].hand.concat(this.players[playerId].hand.splice(0, 1))
      this.deckUsed = this.deckUsed.concat(deckUsedOneCard)
      var deckUsedOneCard = []
    } else { // om spelaren har 2 eller fler kort i handen! STÅR SAMMA SAK! behöver inte if else??
      console.log('DEBUG: spelarens hand är 2 eller längre!')
      const lengthOfPlayersHand = this.players[playerId].hand.length

      var multipleUsedCards = this.players[playerId].hand.concat(this.players[playerId].hand.splice(0, lengthOfPlayersHand))
      this.deckUsed = this.deckUsed.concat(multipleUsedCards)
      var multipleUsedCards = []
    }

    console.log('slänghögen fylls med korten:')
    console.table(this.deckUsed)

  }
  debugPlayers () {
    return this.players
  }
  startGame () {
    // setup
    this.gameSetup()

    // Dealer play with players one at a time
    const numOfPlayers = this.numberOfPlayers
    for (let i = 0; i <= numOfPlayers - 1; i++) {
      const j = i + 1
      //console.log('id: ', j)
      this.gameRound(j)
    }
  }
}

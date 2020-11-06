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
    this.deck = []
    this.deckUsed = []
    this.numberOfPlayers = 0
    this.winner = ''
  }

  gameSetup () {
    this.deck = Deck.create() // Creates deck
    Deck.shuffle(this.deck) // shuffle cards

    // Number of Players
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

    this.players.push(new CreatePlayer('Dealer   :'))// creates dealer

    // create players + gives first card
    for (let i = 0; i <= this.numberOfPlayers - 1; i++) { // skapar spelarna och summerar (ej dealer)
      // creates player
      const PlayerNumber = i + 1
      const createPlayerName = 'Player #' + PlayerNumber + ': '
      this.players.push(new CreatePlayer(createPlayerName))


      this.players[PlayerNumber].hand = this.deck.splice(0, 1) // gives all players first card
      this.sumCards(i) // sums cards
    }
    console.log('spelarna')
    console.table(this.players)
    console.table(this.dealer)
    console.log('---------gameSetup()-slut---------------')
  }

  reShuffleCards () {
    console.log('method reShuffleCards starts!')    //debug
    console.log('kortleken har 1 kort??')    //debug
    console.table(this.deck)    //debug
    
    console.log('kort i deck used:')
    console.table(this.deckUsed)

    const lengthOfUsedDeck = this.deckUsed.length
    var tempReturnCardsToDeck = this.deckUsed.concat(this.deckUsed.splice(0, lengthOfUsedDeck))
    this.deck = this.deck.concat(tempReturnCardsToDeck)
    var tempReturnCardsToDeck = []

    console.log('deckused tom?')    //debug
    console.table(this.deckUsed)    //debug
    console.log('deck fylld?')    //debug
    console.table(this.deck)    //debug

    if (this.deck.length < 2) {
      process.exitCode = 1 // Övrigt fel, kortleken räcker inte till antalet spelare
      throw new Error('Too many players, the amount of cards are not enough')
    }

    //blandar korten
    Deck.shuffle(this.deck)

    console.log('deck blandad?')    //debug
    console.table(this.deck)    //debug
    console.log('method reShuffleCards end!')    //debug
  }
  aceCheck (playerId) {

  
    // om aceCount loopen hittar ett eller flera ace
    console.log('-----------ace tester-------------')
    // en loop som kontrollerar essen här! FLYTTAS TILL SUM METOD
    var aceCount = 0
    for (let i = 0; i < this.players[playerId].hand.length; i++) {
      console.log('kontrollerar kort nr: ', i)
      if (this.players[playerId].hand[i].rank === 1) {
        console.log('jag hittade ett ess!!')
        aceCount += 1

      }
    }
    if (aceCount > 0) {
      var extraAceValue = 13 * aceCount
      var altTotVal = this.players[playerId].totVal + extraAceValue

      if(altTotVal > this.players[playerId].totVal && altTotVal < 21) { // om 14 är bättre alternativ
        console.log('DEBUG: ace ändrar värde till 14')
        this.players[playerId].totVal = altTotVal
      } else if (this.players[playerId].totVal > 21 && aceCount > 0) { // om summan är över 21 och det förekommer ett eller flera ess
        //går tillbaks till 1 om det är bättre än 14!
        if (this.players[playerId].totVal - extraAceValue < 21) {
          console.log('DEBUG: ace går tillbaks till värdet 1')
          this.players[playerId].totVal = this.players[playerId].totVal - extraAceValue
        }
      } else if (aceCount > 0 && altTotVal === 21) { // när det finns ess och summan blir 21 med 14 som värde
        console.log('spelarens två första kort är 21!!')
        this.players[playerId].totVal = altTotVal
      } else {
        console.log('DEBUG: ACE ÄNDRADES INTE!')
      }
    }
    console.log('aceCounter result: ', aceCount)
    // this.players[playerId].hand[0].rank //skriver ut ranken för hand index 0


    console.log('-----------slut ace tester-------------')
  }
  playerDealerRules (playerId) {

    // Spelets regler
    if (this.players[playerId].totVal === 21) { // spelares kort lika med 21
      console.log('Player win!')
      this.winner = 'player'
    } else if (this.players[playerId].hand.length == 5 && this.players[playerId].totVal < 21) { // 5 kort och sum mindre än 21 (testad fungerar!)
      console.log('Player Win! 5 kort & mindre än 21!')
      this.winner = 'player'
    } else if (this.players[playerId].totVal > 21) { // player mer än 21
      console.log('Dealer Win!')
      this.winner = 'dealer'
    } else if (this.players[0].hand.length > 0) { // om dealern handlängd är mer än 0 (har kort)
      // dessa testas om dealern har kort!
      if (this.players[0].totVal === 21) { // dealerns hand = 21
        console.log('dealers totVal = 21, Dealer win!1')
        this.winner = 'dealer'
      } else if (this.players[0].hand.length == 5 && this.players[0].totVal < 21) { // dealern exakt 5 kort och mindre än 21
        console.log('Dealer Win! 5 kort & mindre än 21!1')
        this.winner = 'dealer'
      } else if (this.players[0].totVal > 21) {
        console.log('dealer Lost! Player Won!') // funkar!
        this.winner = 'player'
      } else if (this.players[0].totVal < 21 && this.players[0].totVal >= this.players[playerId].totVal ) { // om givens kort är mindre än 21 OCH större eller lika med spelarens, vinner given
        console.log('dealer less than 21 and more than or equal player totval, dealer win!1')
        this.winner = 'dealer'
      } else if (this.players[0].totVal < 21 && this.players[0].totVal < this.players[playerId].totVal) { // om spelaren är större! då vinner spelaren!
        console.log('spelaren är större än dealern!, spelaren VINNER!!(nya!!)')
        this.winner = 'player'
      } else { // fångar buggar! har ingen exit code!
        console.log('något kanske är fel! kolla upp startDealer metod!!') // fixa!! kommer hit om båda får samma totVal!
        throw new Error('något är fel med dealerns regler!!')
      }
    }else if (this.players[playerId].totVal < 21) { // player mindre än 21, startar dealer
      console.log('GIVENS TUR!')
      console.log('debug', playerId)
      this.startDealer(playerId)
    } else {  // fångar buggar! har ingen exit code!
      console.log('något fel med dealerns ELLER player regler!!') // fixa!! kommer hit om båda får samma totVal!
      throw new Error('något är fel med player regler!!')
    }
  }
  sumCards (playerId) {
    const handLength = this.players[playerId].hand.length // Length of playerId hand
    let newTotVal = 0
    for (let a = 0; a <= handLength - 1; a++) { // Sum cards
      newTotVal = newTotVal + this.players[playerId].hand[a].rank
    }
    this.players[playerId].totVal = newTotVal
  }
  dealerPlayerNewCard (playerId, maxtotVal) {
    console.log('-------------dealerPlayerNewCard method starts-----------------')
    console.log('spelar max till ', maxtotVal)
    
    this.aceCheck(playerId) // decides if ace = 1 or 14

    if (this.players[playerId].totVal < maxtotVal) {
    for (let i = 0; this.players[playerId].totVal < maxtotVal; i++) { // var innnan <= ändrade! ska inte dra om det är maxtotval!
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
        this.players[playerId].hand = this.players[playerId].hand.concat(this.deck.splice(0, 1))// Adds one card to hand
        this.sumCards(playerId) // Sum cards
      }
      this.aceCheck(playerId) // decides if ace = 1 or 14
    }
    console.log('-----------------dealerPlayerNewCard method ends----------------')
    }
  }
  sumCards (playerId) { // metoden summerar korten (används på flera ställen!)
    const handLength = this.players[playerId].hand.length // returns 2
    // console.log('handens längd2: ', handLenght2) //debug
    let newTotVal = 0
    // console.log(this.dealer[0].hand[0].rank)
    for (let a = 0; a <= handLength - 1; a++) { // summerar korten i handen
      newTotVal = newTotVal + this.players[playerId].hand[a].rank
    }
    this.players[playerId].totVal = newTotVal
  }
  startDealer (playerId) {
    console.log('---------------dealern börjar spela för spelare nr: ', playerId + 1, '-----------------')
    // ger dealern första kortet
    if (this.deck.length === 1) { // fungerar inte när använda ska flyttas till deck och blandas igen! hoppar över när deck.length är 1.. !
      this.reShuffleCards() // kallar på metoden som flyttar tbx och blandar korten till draghögen
    }
    this.players[0].hand = this.deck.splice(0, 1) // Dealer first card
    this.sumCards(0) // decides if ace = 1 or 14

    this.dealerPlayerNewCard(0, 17) // Dealer adds one card until totval => 17

    console.table(this.players) // debug
    console.log(this.players[0].hand) // debug korten
    this.playerDealerRules(playerId) // Game Rules
       
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
    if (this.players[0].hand.length === undefined) {
      console.log('Dealer   :',' -', bustedDealer)
    } else {
    console.log(`${this.players[0]}`, bustedDealer) // behöver antagligen skrivas på annat sätt!
    }

    if (this.winner === 'player') {
      console.log('Player wins!')
    } else if (this.winner === 'dealer') {
      console.log('Dealer wins!')
    }
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

    this.sumCards(playerId) // sum cards

    console.log('Spelare', playerId, 'är redo att börja spela')
    console.table(this.players) // kontrollera att summan stämmer för player1

    // spelarens val
    console.log('Börjar spela:')

    if (this.players[playerId].totVal === 21) { // detta upprepas i testPlayerTotVal men går direkt till givens tur isf! (fix eller behåll upprepning?)
      console.log('Player win!')
      this.winner = 'player'
    } // OBS man kan förlora här om man får 13 + 12 !! (eller kontrolleras detta innan fler kort ges?)

  //spelaren fortsätter spela
  this.dealerPlayerNewCard(playerId, 14) // skickar spelar index och spelarnas (alla) högsta totval för att ta nytt kort

    console.log('debug spelare: ')
    console.table(this.players) // debug

    //fixa här
    this.playerDealerRules(playerId) // testar om spelarens värden är 21 mer sen!

    // resultat
    this.results(playerId) // metod som skriver ut omgångens resultat

    //dealerns hand flytts till slänghögen! (slå ihop med spelarna??)
    if (this.players[0].hand.length > 0) {
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
    }

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

    //tömmer spelaren och ev dealerns totval (behöver egentligen inte återställa totVal)
    this.sumCards(0)
    this.sumCards(playerId)

    console.log('slänghögen fylls med korten:')
    console.table(this.deckUsed)

    console.log('debug spelarna')
    console.table(this.players)

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

/**
 * Module for Game
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */
import { Deck } from './Deck.js'
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
    } else if ((process.argv[2] > 0 && process.argv[2] < 8) || process.argv[2] === '20' || process.argv[2] === '50') {
      this.numberOfPlayers = process.argv[2]
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
  }

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

  aceCheck (playerId) {
    var aceCount = 0
    for (let i = 0; i < this.players[playerId].hand.length; i++) {
      // counts ace
      aceCount = 0
      for (let i = 0; i < this.players[playerId].hand.length; i++) {
        if (this.players[playerId].hand[i].rank === 1) {
          aceCount += 1
        }
      }
    }
    var extraAceValue = 13 * aceCount
    var altTotVal = this.players[playerId].totVal + extraAceValue
    if (aceCount > 0 && this.players[playerId].totVal < 21) { // om aceCount har hittat kort och vanliga totalvärdet är mindre än 21
      if ((this.players[playerId].totVal + extraAceValue) <= 21) {
        this.players[playerId].totVal = altTotVal
      }
    }
  }

  playerDealerRules (playerIndex, thePlayer) { // playerIndex = dealer eller en spelare, thePlayer = spelaren som dealerns kort jämförs med
    if (this.players[playerIndex].totVal === 21) { // spelares kort lika med 21
      this.winner = playerIndex
    } else if (this.players[playerIndex].hand.length === 5 && this.players[playerIndex].totVal < 21) { // 5 kort och sum mindre än 21 (testad fungerar!)
      this.winner = playerIndex
    } else if (this.players[playerIndex].totVal > 21) { // player mer än 21
      if (playerIndex > 0) {
        this.winner = 0
      } else {
        this.winner = 1 // hårdkodad 1a är en spelare som vinner oavsett vilken!
      }
    } else if (this.players[0].totVal === 0 && this.players[playerIndex].totVal < 21) { // player mindre än 21, startar dealer
      this.startDealer(playerIndex)
    } else if (this.players[0].totVal < 21 && this.players[0].totVal >= this.players[thePlayer].totVal) { // om givens kort är mindre än 21 OCH större eller lika med spelarens, vinner given
      this.winner = 0
    } else if (this.players[0].totVal < 21 && this.players[0].totVal < this.players[thePlayer].totVal) { // om spelaren är större! då vinner spelaren!
      this.winner = thePlayer
    } else { // Om det finns en bugg i reglerna
      process.exitCode = 1
      throw new Error('The outcome has no rule!')
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
    this.aceCheck(playerId) // decides if ace = 1 or 14

    if (this.players[playerId].totVal < maxtotVal) {
      for (let i = 0; this.players[playerId].totVal < maxtotVal; i++) { // var innnan <= ändrade! ska inte dra om det är maxtotval!
        if (this.deck.length === 1) { // denna är buggad när oblandat och 50 spelare!
          this.reShuffleCards() // kallar på metoden som flyttar tbx och blandar korten till draghögen
        } else if (this.deck.length === 0) {
          process.exitCode = 27// Kod 27 = går inte att dra kort från draghögen!
          throw new Error('deck is empty')
        } else {
          if (this.players[playerId].hand.length === 5) { // bryter loopen om spelaren har 5 kort längre ner kommer villkor som gör att spelaren vinner om den har 5 kort och mindre än 21!
            break
          }
          this.players[playerId].hand = this.players[playerId].hand.concat(this.deck.splice(0, 1))// Adds one card to hand
          this.sumCards(playerId) // Sum cards
        }
        this.aceCheck(playerId) // decides if ace = 1 or 14
      }
    }
  }

  startDealer (playerId) {
  // ger dealern första kortet
    if (this.deck.length === 1) { // fungerar inte när använda ska flyttas till deck och blandas igen! hoppar över när deck.length är 1.. !
      this.reShuffleCards() // kallar på metoden som flyttar tbx och blandar korten till draghögen
    }
    this.players[0].hand = this.deck.splice(0, 1) // Dealer first card
    this.sumCards(0) // decides if ace = 1 or 14
    this.dealerPlayerNewCard(0, 17) // Dealer adds one card until totval => 17
    this.playerDealerRules(0, playerId) // Game Rules
  }

  results (playerId) { // Skriver ut omgångens resultat
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
      throw new Error('något fel 321')
    }

    console.log(`${this.players[playerId]}`, bustedPlayer)
    if (this.players[0].hand.length === undefined) {
      console.log('Dealer   :', ' -', bustedDealer, '\n', winnerText, '\n')
    } else {
      console.log(`${this.players[0]}`, bustedDealer, '\n', winnerText, '\n') // behöver antagligen skrivas på annat sätt!
    }

    //console.log(winnerText)
  }

  gameRound (playerId) { // spelar med en spelare
    if (this.deck.length === 1) { // fungerar inte när använda ska flyttas till deck och blandas igen! hoppar över när deck.length är 1.. !
      this.reShuffleCards() // kallar på metoden som flyttar tbx och blandar korten till draghögen
    } else {
      // ger det andra "startkortet"
      this.players[playerId].hand = this.players[playerId].hand.concat(this.deck.splice(0, 1))
    }
    this.sumCards(playerId) // sum cards
    // spelarens val

    if (this.players[playerId].totVal === 21) { // detta upprepas i testPlayerTotVal men går direkt till givens tur isf! (fix eller behåll upprepning?)
      this.winner = 'player'
    } // OBS man kan förlora här om man får 13 + 12 !! (eller kontrolleras detta innan fler kort ges?)

    // spelaren fortsätter spela
    this.dealerPlayerNewCard(playerId, 14) // skickar spelar index och spelarnas (alla) högsta totval för att ta nytt kort
    this.playerDealerRules(playerId) // testar om spelarens värden är 21 mer sen!
    // resultat
    this.results(playerId) // metod som skriver ut omgångens resultat

    // dealerns hand flyttas till slänghögen, är dealerns hand tom flyttas inga kort.
    this.deckUsed = this.deckUsed.concat(this.players[0].hand.concat(this.players[0].hand.splice(0, this.players[0].hand.length)))

    // spelarens hand flyttas till slänghögen
    this.deckUsed = this.deckUsed.concat(this.players[playerId].hand.concat(this.players[playerId].hand.splice(0, this.players[playerId].hand.length)))

    // tömmer spelaren och ev dealerns totval (behöver egentligen inte återställa totVal)
    this.sumCards(0)
    this.sumCards(playerId)
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
      // console.log('id: ', j)
      this.gameRound(j)
    }
  }
}

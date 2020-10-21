/**
 * The starting point of the application.
 *
 * @author Johan Leitet <johan.leitet@lnu.se>
 * @author Mats Loock <mats.loock@lnu.se>
 * @author // TODO: YOUR NAME <YOUR EMAIL>
 * @version 1.0.0
 */

// TODO: Replace the code below with your own game logic.

import { Deck } from './Deck.js'

try {
  // Create 52 playing cards and...
  const playingCards = Deck.create()
  // ...shuffle them. 
  Deck.shuffle(playingCards)

  // Draw three playing cards, view the remaining playing cards, the drawn playing cards and
  // then calculate the value of them.
  // (`value + playingCard` implicitly calls PlayingCard#valueOf to get
  //  the primitive value of the current PlayingCard object.)
  
//test vad som händer när array ("kortlek") är tom 

  const testArray = new Array(1, 2, 3, 4, 5, 6)

  const hej1 = testArray.splice(0, 3)
  console.log(hej1)

  const hej2 = testArray.splice(0, 3)
  console.log(hej2)

  const hej3 = testArray.splice(0, 3) // om arrayn är tom returneras tom array
  console.log(hej3)

 //En spelomgång med en spelare, returnerar player och dealers kort (finns det dubbletter med denna metod?)

  //Player

  const hand = playingCards.splice(0, 3)

  const valuePlayer = hand.reduce((value, playingCard) => value + playingCard, 0)
  console.log(` Player: ${hand.join(' ')} (${valuePlayer})`)

  //Dealer
  const dealer = playingCards.splice(0, 3)

  const valueDealer = dealer.reduce((value, playingCard) => value + playingCard, 0)
  console.log(` Dealer: ${dealer.join(' ')} (${valueDealer})`)

  //Visar använda kort
  console.log('debug använda kort: ', Deck.used())

} catch (e) {
  console.error(e.message)
}

/*
try {
  // Create 52 playing cards and...
  
  const playingCards = Deck.create()
  console.log(playingCards.join(', '), '\n')

  // ...shuffle them.
  
  Deck.shuffle(playingCards)
  console.log(playingCards.join(', '), '\n')

  // Draw three playing cards, view the remaining playing cards, the drawn playing cards and
  // then calculate the value of them.
  // (`value + playingCard` implicitly calls PlayingCard#valueOf to get
  //  the primitive value of the current PlayingCard object.)
  const hand = playingCards.splice(0, 3)

  console.log(playingCards.join(', '))

  const value = hand.reduce((value, playingCard) => value + playingCard, 0)
  console.log(`${hand.join(' ')} (${value})`)
} catch (e) {
  console.error(e.message)
}
*/

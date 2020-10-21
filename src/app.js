/**
 * The starting point of the application.
 *
 * @author Johan Leitet <johan.leitet@lnu.se>
 * @author Mats Loock <mats.loock@lnu.se>
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

// TODO: Replace the code below with your own game logic.

import { Deck } from './Deck.js'
import { PlayingCard } from './PlayingCard.js'

try {
  //ta emot antal spelare (från start)

  const numberOfPlayers = process.argv[2]
 
  if (process.argv[2] === undefined) { //om användaren inte anger antal spelare sätts antalet automatiskt till 1.
    process.argv.push(1)
  }


  //returnerar antal spelare i omgången till konsoll:

  console.log(`Denna spelomgång har såhär många spelare: ${numberOfPlayers}`)

  // game logic:

  //slänghög

  const used = new Array() // använd: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat

  // Create 52 playing cards and...
  const playingCards = Deck.create()
  
  // ...shuffle cards 
  Deck.shuffle(playingCards)


  // Players: first card

  const playersObject = {} // sparar spelarnas kort

  for (let i = 1; i <= process.argv[2]; i++ ) { // ger alla spelare ett första kort
    if (playingCards.length === 0) { // om draghögen är tom!
      process.exitCode = 27
      throw new Error('Draghögen är tom!')
      }else{
    const hand = playingCards.splice(0, 1)
    const valuePlayer = hand.reduce((value, playingCard) => value + playingCard, 0)
    playersObject[`Player #${i}:`] = hand.join(' ') + `(${valuePlayer})` // lägger till spelarens kort och summa i ett objekt, flytta summan till en array istället??
    //console.log(` Player #${i}: ${hand.join(' ')} (${valuePlayer})`)  //Denna lösning sparar inte spelarnas kort!
      }
  }

  console.log(playersObject) // skriver ut spelarnas kort i ett objekt

  // Dealer:



console.log('===========================')
  
  // vem som har högst summa (vinnare)

const winner = function (valuePlayer, valueDealer) { // ta med 21 gränsen!
if (valuePlayer > valueDealer) {
  return 'Player wins!'
}else if (valueDealer > valuePlayer) {
  return 'Dealer wins!'
} else {
    return 'wuut :O'
}
}
console.log('Vinnaren är: ', winner(valuePlayer, valueDealer))
} catch (e) {
  console.error(e.message)
}

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
import { CreatePlayer } from './CreatePlayer.js'
import { CreateGame } from './Game.js'

try {
  const theGame = new CreateGame()
  theGame.startGame()
  //console.log(theGame.toString())


  //debug
  console.log('---------------------------')
  console.log(`${theGame.debugPlayers()}`)
  //console.log(theGame.debugCardsLeft())
  //console.log(theGame.debugUsedCards())

} catch (e) {
  console.error(e.message)
}

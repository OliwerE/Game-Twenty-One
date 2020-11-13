/**
 * The starting point of the application.
 *
 * @author Johan Leitet <johan.leitet@lnu.se>
 * @author Mats Loock <mats.loock@lnu.se>
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

import { CreateGame } from './Game.js'

try {
  const theGame = new CreateGame()
  theGame.startGame()
  // console.log(theGame.toString())
} catch (e) {
  console.error(e.message)
}

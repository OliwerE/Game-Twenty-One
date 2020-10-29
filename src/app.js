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
import { Players } from './Players.js'

try {
  const playingCards = Deck.create()

    // ...shuffle cards 
    //Deck.shuffle(playingCards) //använd sen

  const createPlayer = new Players()

  createPlayer.playerName = 'Player 1'

  createPlayer.hand = playingCards.splice(0, 3)

  console.log(createPlayer.toString())

  console.table(createPlayer.hand)

} catch (e) {
  console.error(e.message)
}

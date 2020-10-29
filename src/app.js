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

  const createPlayer = new Players() //skapar EN ny spelare

  createPlayer.playerName = 'Player #1:' //sätter namnet på spelaren

  createPlayer.hand = playingCards.splice(0, 3) // ger spelaren tre kort (ska egentligen börja med 1!!)


  //sätter spelarens summa
  var sum = 0
  const numOfCards = createPlayer.hand.length - 1
  for (let i = 0; i <= numOfCards ; i++) {
    sum = sum + createPlayer.hand[i].rank
  }

  console.log('summan är ', sum)



  
 //visar spelarens kort i en tabell
  console.table(createPlayer.hand)


  
  //settern i player lägger till sum i spelarens totVal
  createPlayer.setSum = sum

  //skriver ut en text med spelarens data
  console.log(createPlayer.toString())

} catch (e) {
  console.error(e.message)
}

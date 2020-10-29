/**
 * Module for Player
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

export class Players {
    constructor (name, hand, totVal) {
    this.playerName = name 
    this.hand = {} //spelarens kort 
    this.totVal = 0
    }
    set setSum (sum) { //lägger in nya summan (inte än)
      this.totVal = sum
    }
    toString () {
      return `spelaren heter: ${this.playerName}, spelaren har följande kort: ${this.hand} och summan är: ${this.totVal} `
    }

}
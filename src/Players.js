/**
 * Module for Player
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

export class Players {
    constructor (name) {
    this.playerName = name 
    this.hand = {} //spelarens kort 
    this.totVal = 0
    }
    toString () {
      return `spelaren heter: ${this.playerName}, spelaren har följande kort: ${this.hand} och summan är: ${this.totVal} `
    }

}
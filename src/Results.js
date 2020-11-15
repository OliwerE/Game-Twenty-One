/**
 * Module for the result.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Represents the game twenty one
 *
 * @class
 */
export class Result {
  /**
   * A method displaying results to the user.
   *
   * @function results
   * @param {number} winner - A number representing a winner (higher than 0, player wins).
   * @param {object} player - An object representing a player
   * @param {object} dealer - An object representing the dealer.
   * @param {number} dealerHandLength - Number of cards in dealers hand.
   */
  static results (winner, player, dealer, dealerHandLength) {
    var bustedPlayer = ''
    var bustedDealer = ''
    var winnerText = ''

    if (winner > 0) { // If winner is a player.
      bustedDealer = 'BUSTED!'
      winnerText = 'Player wins!'
    } else if (winner === 0) { // if winner is the dealer.
      bustedPlayer = 'BUSTED!'
      winnerText = 'Dealer wins!'
    } else {
      process.exitCode = 1
      throw new Error('this.winner is less than 0, Something went wrong!')
    }

    if (dealerHandLength === 0) {
      console.log(`${player} ${bustedPlayer}\nDealer   :  - ${bustedDealer}\n${winnerText}\n`)
    } else {
      console.log(`${player} ${bustedPlayer}\n${dealer} ${bustedDealer}\n${winnerText}\n`)
    }
  }
}

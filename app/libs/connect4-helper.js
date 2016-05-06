'use strict';

/**
 * Utility for Connect 4
 */
module.exports = {

	getMessage: function(game) {
		if (!game)
			return '';
		var p = game.getNextPlayerId();
		var winner = game.getWinner();
		if (winner) {
			if (game.playerCount == 1 && winner.id == 0) {
				return 'You win!';
			} else {
				return `${winner.name} wins!`;
			}
		} else if (game.isDraw()) {
			return 'Draw game';
		} else {
			if (game.playerCount == 1 && p == 0) {
				return 'Your turn';
			} else {
				var player = game.players[p];
				return `${player.name}'s turn`;
			}
		}
	}

};
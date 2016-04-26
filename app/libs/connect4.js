'use strict';

/**
 * Game engine of Connect 4
 */
const Connect4 = {

	playerCount: 1,  // number of players
	playerNames: [], // player names
	difficulty: 2, 	 // difficulty (0 - human mode, 1 - easy, 2 - moderate, 3 - hard)
	firstPlayer: 0,  // the id of the player who takes the first move
	rows: 6,         // the number of rows in the game board
	cols: 7,		 // the number of columns in the game board
	winLength: 4,    // the number of consecutive pieces which form a winning move

	Player: Player,
	Move: Move,

	init: function(gameConfig) {		
		Object.assign(this, {
			cells: [],		 // cells
			moves: [],		 // moves
			nextRows: []	 // the next available rows for each column
		}, gameConfig);
		for (var i=0; i<this.cols; i++) {
			this.nextRows[i] = this.rows - 1;
		}
		this.initPlayers();
		return this;
	},

	/**
	 * Initializes players
	 */
	initPlayers: function() {
		this.players = [];
		for (var i=0; i<this.playerCount; i++) {
			this.players[i] = new Player(i, this.playerNames[i] || 'Player ' + (i + 1), 0);
		}
		if (this.playerCount == 1) {
			this.players[1] = new Player(1, 'Computer', this.difficulty);
		}
	},

	/** 
	 * Drops a piece and returns the move info
	 */
	dropPiece: function(colIndex) {
		if (colIndex >= 0 && colIndex <= this.cols - 1 && this.getWinner() == null) {
			var nextRowIndex = this.getNextRow(colIndex);
			if (nextRowIndex >= 0) {
				var nextPlayerId = this.getNextPlayerId();
				var move = new Move(nextPlayerId, nextRowIndex, colIndex);
				if (this._getMaxLength(nextPlayerId, nextRowIndex, colIndex) >= this.winLength)
					move.winning = true;
				this.moves.push(move);
				this.setCell(nextRowIndex, colIndex, nextPlayerId);
				this.nextRows[colIndex] = nextRowIndex - 1;
				return move;
			}
		}
		return null;
	},

	/**
	 * Determines which column should the piece be dropped
	 */
	determineColumn: function(player) {
		var col;
		var maxLens = this.players.map((p, i) => {
			return this.nextRows.map((r, c) => {
				return r != -1 ? this._getMaxLength(p.id, r, c) : 0;
			});
		});
		col = maxLens[player.id].findIndex(len => len >= this.winLength);
		if (col != -1) {
			return col; // picks the winning move
		}
		for (var i=0; i<this.players.length; i++) {
			var p = this.players[i];
			if (p != player) {
				col = maxLens[p.id].findIndex(len => len >= this.winLength);
				if (col != -1) {
					return col; // blocks another player's winning move
				}
				if (player.ai >= 2) { // for Moderate or above
					col = maxLens[p.id].findIndex(len => len >= this.winLength - 1);
					if (col != -1) {
						return col; // blocks another player's threat
					}
				}
			}
		}
		col = this._getIndexOfMax(maxLens[player.id]);
		return col;
	},

	/**
	 * Reverts the last move and returns the move info
	 */
	revert: function() {
		if (this.moves.length > 0) {
			var move = this.moves.splice(-1, 1)[0];
			this.nextRows[move.colIndex]--;
			this.setCell(move.rowIndex, move.colIndex, undefined);
			return move;
		}
		return null;
	},

	/**
	 * Sets the player who occupies a cell
	 */
	setCell: function(rowIndex, colIndex, playerId) {
		this.cells[this.getCellIndex(rowIndex, colIndex)] = playerId;
	},

	/**
	 * Gets the player who occupies a cell
	 */
	getCell: function(rowIndex, colIndex) {
		return this.cells[this.getCellIndex(rowIndex, colIndex)];
	},

	/**
	 * Gets the index of the next available row for a column
	 */
	getNextRow: function(colIndex) {
		var rowIndex = this.nextRows[colIndex];
		return rowIndex != null ? rowIndex : this.rows - 1;
	},

	/**
	 * Gets the next player ID
	 */
	getNextPlayerId: function() {
		return this.moves.length > 0 ? (this.moves[this.moves.length - 1].playerId + 1) % this.players.length : this.firstPlayer;
	},

	/**
	 * Gets the next player
	 */
	getNextPlayer: function() {
		return this.players[this.getNextPlayerId()];
	},

	/**
	 * Gets the cell index
	 */
	getCellIndex: function(rowIndex, colIndex) {
		return rowIndex * this.cols + colIndex;
	},

	/**
	 * Gets the winner of the game, or null if the game has not ended
	 */
	getWinner: function() {
		if (this.moves.length > 0) {
			var lastMove = this.moves[this.moves.length - 1];
			if (lastMove.winning) {
				return lastMove.playerId;
			}
		}
		return null;
	},

	/**
	 * Renders the game board
	 */
	render: function(stream) {
		for (var i=0; i<this.rows; i++) {
			for (var j=0; j<this.cols; j++) {
				var c = this.getCell(i, j);
				stream.write( c != null && c != undefined ? String(c) : '-' );
			}
			stream.write('\n');
		}

	},

	/**
	 * Gets the maximum length obtained for a move
	 */
	_getMaxLength: function(playerId, rowIndex, colIndex) {
		var c, lens = [];
		// row check
		c = 1;
		for (var d=-1; colIndex+d>=0 && this.getCell(rowIndex, colIndex+d) == playerId; d--) c++;
		for (var d=1; colIndex+d<=this.cols-1 && this.getCell(rowIndex, colIndex+d) == playerId; d++) c++;
		lens.push(c);
		// column check
		c = 1;
		for (var d=-1; rowIndex+d>=0 && this.getCell(rowIndex+d, colIndex) == playerId; d--) c++;
		for (var d=1; rowIndex+d<=this.rows-1 && this.getCell(rowIndex+d, colIndex) == playerId; d++) c++;
		lens.push(c);
		// diagonal check #1 (top-right to bottom-left)
		c = 1;
		for (var d=1; rowIndex+d<=this.rows-1 && colIndex-d>=0 && this.getCell(rowIndex+d, colIndex-d) == playerId; d++) c++;
		for (var d=1; rowIndex-d>=0 && colIndex+d<=this.cols-1 && this.getCell(rowIndex-d, colIndex+d) == playerId; d++) c++;
		lens.push(c);
		// diagonal check #2 (top-left to bottom-right)
		c = 1;
		for (var d=1; rowIndex-d>=0 && colIndex-d>=0 && this.getCell(rowIndex-d, colIndex-d) == playerId; d++) c++;
		for (var d=1; rowIndex+d<=this.rows-1 && colIndex+d<=this.cols-1 && this.getCell(rowIndex+d, colIndex+d) == playerId; d++) c++;
		lens.push(c);
		return Math.max(...lens);
	},

	/**
	 * Checks if a move is winning
	 */
	_isWinningMove: function(playerId, rowIndex, colIndex, winLength) {
		return this._getMaxLength(playerId, rowIndex, colIndex) >= this.winLength;
	},

	/**
	 * Gets the index of the maximum value in an array
	 */
	_getIndexOfMax: function(arr) {
		if (arr.length > 0) {
			var maxIndex = 0, max = arr[0];
			for (var i=1; i<=arr.length; i++) {
				if (arr[i] > max) {
					max = arr[i];
					maxIndex = i;
				}
			}
			return maxIndex;
		}
		return -1;
	}

};

function Player(id, name, ai) {
	this.id = id;
	this.name = name;
	this.ai = ai;
}

function Move(playerId, rowIndex, colIndex) {
	this.playerId = playerId;
	this.rowIndex = rowIndex;
	this.colIndex = colIndex;
	this.winning = false;
}

if (typeof module !== 'undefined') {
	module.exports = Connect4;
}

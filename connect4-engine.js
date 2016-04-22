'use strict';

class Player {

	constructor(id, name, ai) {
		this.id = id;
		this.name = name;
		this.ai = ai;
	}
}

class Move {

	constructor(playerId, rowIndex, colIndex) {
		this.playerId = playerId;
		this.rowIndex = rowIndex;
		this.colIndex = colIndex;
		this.winning = false;
	}
}

class Connect4 {

	constructor(gameConfig) {
		Object.assign(this, {
			cells: [],
			moves: [],
			nextRows: []
		}, Connect4.defaultConfig, gameConfig);
		for (var i=0; i<this.cols; i++) {
			this.nextRows[i] = this.rows - 1;
		}
		this.initPlayers();
	}

	/**
	 * Initializes players
	 */
	initPlayers() {
		this.players = [];
		for (var i=0; i<this.playerCount; i++) {
			this.players[i] = new Player(i, this.playerNames[i] || 'Player ' + (i + 1), 0);
		}
		if (this.playerCount == 1) {
			this.players[1] = new Player(1, 'Computer', this.difficulty);
		}
	}

	/** 
	 * Drops a piece and returns the move info
	 */
	dropPiece(colIndex) {
		if (colIndex >= 0 && colIndex <= this.cols - 1 && this.getWinner() == null) {
			var nextRowIndex = this.getNextRow(colIndex);
			if (nextRowIndex >= 0) {
				var cellIndex = this.getCellIndex(nextRowIndex, colIndex);
				var nextPlayerId = this.getNextPlayerId();
				var move = new Move(nextPlayerId, nextRowIndex, colIndex);
				this.moves.push(move);
				this.setCell(nextRowIndex, colIndex, nextPlayerId);
				this.nextRows[colIndex] = nextRowIndex - 1;
				if (this.isWinningMove(move)) {
					move.winning = true;
				}
				return move;
			}
		}
		return null;
	}

	/**
	 * Determines which column should the piece be dropped
	 */
	determineColumn(player) {
		// random move
		var filteredCols = [];
		this.nextRows.forEach((r, i) => {
			if (r != -1)
				filteredCols.push(i);
		});
		var pickedCol = Math.floor(Math.random() * filteredCols.length);
		return pickedCol;
	}

	/**
	 * Reverts the last move and returns the move info
	 */
	revert() {
		if (this.moves.length > 0) {
			var move = this.moves.splice(-1, 1)[0];
			this.nextRows[move.colIndex]--;
			this.setCell(move.rowIndex, move.colIndex, undefined);
			return move;
		}
		return null;
	}

	/**
	 * Checks if a move is winning
	 */
	isWinningMove(move) {
		var c, cell;
		// row check
		c = 1;
		for (var d=-1; move.colIndex+d>=0 && this.getCell(move.rowIndex, move.colIndex+d) == move.playerId; d--) c++;
		for (var d=1; move.colIndex+d<=this.cols-1 && this.getCell(move.rowIndex, move.colIndex+d) == move.playerId; d++) c++;
		if (c >= this.winLength) return true;
		// column check
		c = 1;
		for (var d=-1; move.rowIndex+d>=0 && this.getCell(move.rowIndex+d, move.colIndex) == move.playerId; d--) c++;
		for (var d=1; move.rowIndex+d<=this.rows-1 && this.getCell(move.rowIndex+d, move.colIndex) == move.playerId; d++) c++;
		if (c >= this.winLength) return true;
		// diagonal check #1 (top-right to bottom-left)
		c = 1;
		for (var d=1; move.rowIndex+d<=this.rows-1 && move.colIndex-d>=0 && this.getCell(move.rowIndex+d, move.colIndex-d) == move.playerId; d++) c++;
		for (var d=1; move.rowIndex-d>=0 && move.colIndex+d<=this.cols-1 && this.getCell(move.rowIndex-d, move.colIndex+d) == move.playerId; d++) c++;
		if (c >= this.winLength) return true;
		// diagonal check #2 (top-left to bottom-right)
		c = 1;
		for (var d=1; move.rowIndex-d>=0 && move.colIndex-d>=0 && this.getCell(move.rowIndex-d, move.colIndex-d) == move.playerId; d++) c++;
		for (var d=1; move.rowIndex+d<=this.rows-1 && move.colIndex+d<=this.cols-1 && this.getCell(move.rowIndex+d, move.colIndex+d) == move.playerId; d++) c++;
		if (c >= this.winLength) return true;
		return false;
	}

	/**
	 * Sets the player who occupies a cell
	 */
	setCell(rowIndex, colIndex, playerId) {
		this.cells[this.getCellIndex(rowIndex, colIndex)] = playerId;
	}

	/**
	 * Gets the player who occupies a cell
	 */
	getCell(rowIndex, colIndex) {
		return this.cells[this.getCellIndex(rowIndex, colIndex)];
	}

	/**
	 * Gets the index of the next available row for a column
	 */
	getNextRow(colIndex) {
		var rowIndex = this.nextRows[colIndex];
		return rowIndex != null ? rowIndex : this.rows - 1;
	}

	/**
	 * Gets the next player ID
	 */
	getNextPlayerId() {
		return this.moves.length > 0 ? (this.moves[this.moves.length - 1].playerId + 1) % this.players.length : this.firstPlayer;
	}

	/**
	 * Gets the next player
	 */
	getNextPlayer() {
		return this.players[this.getNextPlayerId()];
	}

	/**
	 * Gets the cell index
	 */
	getCellIndex(rowIndex, colIndex) {
		return rowIndex * this.cols + colIndex;
	}

	/**
	 * Gets the winner of the game, or null if the game has not ended
	 */
	getWinner() {
		if (this.moves.length > 0) {
			var lastMove = this.moves[this.moves.length - 1];
			if (lastMove.winning) {
				return lastMove.playerId;
			}
		}
		return null;
	}

	/**
	 * Renders the game board
	 */
	render(stream) {
		for (var i=0; i<this.rows; i++) {
			for (var j=0; j<this.cols; j++) {
				var c = this.getCell(i, j);
				stream.write( c != null && c != undefined ? String(c) : '-' );
			}
			stream.write('\n');
		}

	}

}

Connect4.defaultConfig = {
	playerCount: 1,  // number of players
	playerNames: [], // player names
	difficulty: 2, 	 // difficulty (0 - human mode, 1 - easy, 2 - moderate, 3 - hard)
	firstPlayer: 0,  // the id of the player who takes the first move
	rows: 6,         // the number of rows in the game board
	cols: 7,		 // the number of columns in the game board
	winLength: 4     // the number of consecutive pieces which form a winning move
};

function test() {
	var game = new Connect4({
		playerCount: 2, 
		difficulty: 1 // easy mode
	});
	game.dropPiece(0);
	game.dropPiece(1);
	game.dropPiece(2);
	if (typeof process !== 'undefined') {
		game.render(process.stdout);
	}
	console.log(game);
}
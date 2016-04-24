'use strict';

class Connect4UI {

	constructor(game, config) {
		Object.assign(this, {
			game: game,
			eventListeners: []
		}, Connect4UI.defaultConfig, config);
	}

	initialize() {
		var self = this;
		this.cellBorder = this.cellRadius * this.cellBorderRatio;
		this.cellWidth = (this.cellRadius + this.cellBorder) * 2;
		this.boardWidth = this.game.cols * this.cellWidth + this.cellBorder * 2;
		this.boardHeight = this.game.rows * this.cellWidth + this.cellBorder * 2;
		this.viewBoxWidth = this.boardWidth;
		this.viewBoxHeight = this.boardHeight;

		this.svgContainer = d3.select(this.container)
		   .append('div')
		   .classed('svg-container', true); //container class to make it responsive

		var svg = this.svgContainer
		   .append('svg')
		   //responsive SVG needs these 2 attributes and no width and height attr
		   .attr('preserveAspectRatio', 'xMinYMin meet')
		   .attr('viewBox', `0 0 ${this.viewBoxWidth} ${this.viewBoxHeight}`)
		   //class to make it responsive
		   .classed('connect4ui svg-content-responsive', true);

		var mask = svg.append('defs')
			.append('mask').attr({id: 'game-board-mask'});
		mask.append('rect').attr({
			width: '100%',
			height: '100%',
			fill: '#FFFFFF'
		})
		mask.selectAll('circle')
			.data(Array(this.game.rows * this.game.cols))
			.enter().append('circle')
			.attr({
				cx: (d, i) => (i % this.game.cols) * this.cellWidth + this.cellRadius + this.cellBorder * 2,
				cy: (d, i) => Math.floor(i/this.game.cols) * this.cellWidth + this.cellRadius + this.cellBorder * 2,
				r: this.cellRadius,
				fill: '#000000'
			});

		this.pieceGroup = svg.append('g').classed('piece-group', true);

		svg.append('rect')
			.attr({
				class: 'gameboard'
			})
			.attr({
				width: this.boardWidth, 
				height: this.boardHeight,
				rx: this.cellBorder,
				ry: this.cellBorder,
				fill: this.boardFill
			})
			.style({
				mask: 'url(#game-board-mask)',
				cursor: 'pointer'
			})
			.on('click', function(e) {
		   		var coord = d3.mouse(this),
		   			scaledX = (coord[0] - self.cellBorder) / self.cellWidth,
		   			colIndex = Math.floor(scaledX),
		   			centreX = colIndex * self.cellWidth + self.cellRadius + self.cellBorder * 2,
		   			diffX = coord[0] - centreX;
		   		if (Math.abs(diffX) <= self.cellRadius + self.cellBorder * self.sensitivity) {
		   			self.dropPiece(colIndex);
		   		}
		   	});

		var nextPlayerId = this.game.getNextPlayerId();
		this._publishEvent('message', this._getNextPlayerMessage(nextPlayerId));
		this._publishEvent('nextPlayer', nextPlayerId);
		return this;
	}

	dropPiece(colIndex) {
		if (!this.moving) {
			var move = this.game.dropPiece(colIndex);
			if (move) {
				this.moving = true;
				var cellIndex = this.game.getCellIndex(move.rowIndex, move.colIndex);
				var pieces = this.pieceGroup
					.append('circle')
					.attr({
						class: 'piece',
						cx: move.colIndex * this.cellWidth + this.cellRadius + this.cellBorder * 2,
						cy: move.rowIndex * this.cellWidth + this.cellRadius + this.cellBorder * 2,
						r: this.cellRadius,
						fill: this.playerFill[move.playerId]
					});
				setTimeout(() => {
					this.moving = false;
					if (move.winning) {
						var message = this._getWinMessage(move.playerId);
						this._publishEvent('move', move, message);
						this._publishEvent('message', message);
					} else {
						var nextPlayer = this.game.getNextPlayer();
						var message = this._getNextPlayerMessage(nextPlayer.id);
						this._publishEvent('move', move, message);
						this._publishEvent('message', message);
						this._publishEvent('nextPlayer', nextPlayer.id);
						if (nextPlayer.ai > 0) {
							var col = this.game.determineColumn(nextPlayer);
							this.dropPiece(col);
						}
					}
				}, this.moveDuration);
				
			} else {
				console.log('Invalid move.');
			}
		}
	}

	on(eventName, callback) {
		this.eventListeners[eventName] = callback;
		return this;
	}

	destroy() {
		this.svgContainer.remove();
		this.svgContainer = null;
		this.pieceGroup = null;
	}

	_publishEvent(eventName, ...obj) {
		if (this.eventListeners[eventName]) {
			this.eventListeners[eventName].call(this, ...obj);
		}
	}


	_getNextPlayerMessage(nextPlayerId) {
		if (this.game.playerCount == 1 && nextPlayerId == 0) {
			return 'Your turn';
		} else {
			var player = this.game.players[nextPlayerId];
			return `${player.name}'s turn`;
		}
	}

	_getWinMessage(winnerId) {
		if (this.game.playerCount == 1 && winnerId == 0) {
			return 'You win!';
		} else {
			var player = this.game.players[winnerId];
			return `${player.name} wins!`;
		}
	}

}
Connect4UI.defaultConfig = {
	boardFill: '#3C2807',
	emptyCellFill: '#FFFFFF',
	defaultCellFill: '#808080',
	playerFill: ['yellow', 'red'],
	cellRadius: 20,
	cellBorderRatio: 0.25,
	moveDuration: 400,
	sensitivity: 0.75
};

'use strict';
const React = require('react');
const _ = require('lodash');

module.exports = React.createClass({

	getInitialState: function() {
		return {moving: false};
	},

	get: function(key) {
		return this.props.settings[key] || '';
	},

	getCellBorder: function() {
		return this.get('cellRadius') * this.get('cellBorderRatio');
	},

	getCellWidth: function() {
		return (this.get('cellRadius') + this.getCellBorder()) * 2;
	},

	getBoardDimension: function() {
		var g = this.props.game;
		var cellBorder = this.getCellBorder();
		var cellWidth = this.getCellWidth();
		var boardWidth = g.cols * cellWidth + cellBorder * 2;
		var boardHeight = (g.rows * cellWidth + cellBorder * 2);
		return {width: boardWidth, height: boardHeight};
	},

	getCentrePosition: function(row, col) {
		var cellBorder = this.getCellBorder();
		var cellWidth = this.getCellWidth();
		var cx = col * cellWidth + this.get('cellRadius') + cellBorder * 2;
		var cy = row * cellWidth + this.get('cellRadius') + cellBorder * 2;
		return {x: cx, y: cy};
	},

	getColumnIndex: function(x) {
		var cellBorder = this.getCellBorder();
		var col = (x - 2 * cellBorder - this.get('cellRadius')) / (cellBorder + this.get('cellRadius')) / 2;
		var icol = Math.round(col);
		var diff = Math.abs(col - icol);
		return diff <= this.get('sensitivity') ? icol : -1;
	},

	dropPiece: function(e, col) {
		if (this.state.moving)
			return;
		var g = this.props.game;
		if (col == null && e) {
			// determine column from click event
	    	var rect = e.target.getBoundingClientRect();
		    var boardDim = this.getBoardDimension();
		    var cellBorder = this.getCellBorder(); 
		    var scaledX = (e.clientX - rect.left) / rect.width;
			col = this.getColumnIndex(scaledX * boardDim.width);
		}
	    if (col != -1) {
	    	var move = g.dropPiece(col);
	    	if (move) {
				this.setState({moving: true});
		    	this.props.events.playSound('drop-piece');
		    	this.props.events.updateHeader(move);
				setTimeout(() => {
					this.setState({moving: false});
					if (move.status == 'win' || move.status == 'draw') {
						this.props.events.playSound('win');
						this.props.events.showEndOfGameModal();
					} else {
						var nextPlayer = g.getNextPlayer();
						if (nextPlayer.ai > 0) {
							var col = g.determineColumn(nextPlayer);
							this.dropPiece(e, col);
						}
					}
				}, this.get('moveDuration'));
		    	this.forceUpdate();
		    }
	    }
	},

	render: function() {
		var g = this.props.game, boardDim = this.getBoardDimension();
		return (
			<div id="board-container">
				<div className="svg-container">
					<svg preserveAspectRatio="xMinYMin meet" viewBox={`0 0 ${boardDim.width} ${boardDim.height}`} className="connect4ui svg-content-responsive">
						<defs>
							<mask id="game-board-mask">
								<rect width="100%" height="100%" fill="#FFFFFF"></rect>
								{_.range(g.cols * g.rows).map(n => {
									var centre = this.getCentrePosition(Math.floor(n / g.cols), n % g.cols);
									return (<circle cx={centre.x} cy={centre.y} r={this.get('cellRadius')} fill="#000000"></circle>);
								})}
							</mask>
						</defs>
						<g className="piece-group">
						{g.cells.map((p, n) => {
							var centre = this.getCentrePosition(Math.floor(n / g.cols), n % g.cols);
							return (<circle className="piece" cx={centre.x} cy={centre.y} r={this.get('cellRadius')} fill={this.get('playerFills')[p]}></circle>);
						})}
						</g>
						<rect className={'gameboard' + (this.state.moving ? ' moving' : '')} width={boardDim.width} height={boardDim.height} rx={5} ry={5} fill={this.get('boardFill')} 
							mask="url('#game-board-mask')" onClick={this.dropPiece} ref={c => this.gameboard = c}></rect>
					</svg>
				</div>
			</div>
		);
	}
});
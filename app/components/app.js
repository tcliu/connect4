'use strict';
const React = require('react');
const ReactDom = require('react-dom');

const Nav = require('./nav');
const Header = require('./header');
const Connect4UI = require('./connect4-ui');
const Modals = require('./modals');
const Audio = require('./audio');

const Connect4 = require('../libs/connect4');

module.exports = React.createClass({

	getInitialState: function() {
		return {
			events: {
				newGame: this.newGame,
				openSettings: this.openSettings,
				updateSettings: this.updateSettings,
				showEndOfGameModal: this.showEndOfGameModal,
				updateHeader: this.updateHeader,
				playSound: this.playSound
			},
			settings: {
				playerCount: 1,  // number of players
				maxPlayerCount: 2, // maximum number of players
				playerNames: ['Player 1', 'Player 2'], // default player names
				difficulty: 2, 	 // difficulty (0 - human mode, 1 - easy, 2 - moderate, 3 - hard)
				firstPlayer: 0,  // the id of the player who takes the first move
				rows: 6,         // the number of rows in the game board
				cols: 7,		 // the number of columns in the game board
				winLength: 4,    // the number of consecutive pieces which form a winning move
				sound: 1,		 // 1 - sound on, 2 - sound off

				boardFill: '#0B2C80',	// the board colour
				playerFills: ['yellow', 'red'],	// the colours of player pieces
				cellRadius: 20,			// the cell radius
				cellBorderRatio: 0.25,	// ratio of cell border to cell radius
				moveDuration: 400,		// the duration to drop a piece
				sensitivity: 0.4 // 0 (insensitive) - 0.5 (very sensitive)
			}
		};
	},

	newGame: function(e) {
		var game = Object.create(Connect4).init(this.state.settings);
		this.setState({game: game});
		console.log('New game created.');
	},

	updateSettings: function(e, settings) {
		var createNewGame = this._shouldCreateNewGame(this.state.settings, settings);
		this.setState({settings: settings});
		if (createNewGame) {
			// create a new game
			setTimeout(() => this.newGame(), 200);
		}
		// console.log('Updated', settings);
	},

	openSettings: function(e) {
		this.modals.settingsModal.open();
	},

	showEndOfGameModal: function(e) {
		this.modals.endOfGameModal.open();
	},

	updateHeader: function(move) {
		this.header.forceUpdate();
	},

	playSound: function(audioId) {
		if (this.state.settings.sound == 1) {
			this.audio.playSound(audioId);
		}
	},
	
	_shouldCreateNewGame: function(oldSettings, newSettings) {
		var keys = ['playerCount', 'difficulty', 'rows', 'cols'];
		return keys.find(k => oldSettings[k] != newSettings[k]);
	},

	componentDidMount: function() {
		this.newGame();
	},

	render: function() {
		return (
		<div className="container">
			<Nav settings={this.state.settings} events={this.state.events} />
			{this.state.game ? <Header game={this.state.game} settings={this.state.settings} ref={c => this.header = c} /> : ''}
			{this.state.game ? <Connect4UI game={this.state.game} settings={this.state.settings} events={this.state.events} /> : ''}
			<Modals game={this.state.game} settings={this.state.settings} events={this.state.events} ref={c => this.modals = c} />
			<Audio ref={c => this.audio = c} />
		</div>
		);
	}

});
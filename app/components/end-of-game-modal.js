'use strict';
const React = require('react');
const BS = require('react-bootstrap');
const Helper = require('../libs/connect4-helper');

const Modal = BS.Modal;
const Button = BS.Button;

module.exports = React.createClass({

	getInitialState: function() {
		return {
			showModal: false
		};
	},

	close: function() {
		this.setState({ showModal: false });
	},

	open: function() {
		this.setState({ showModal: true });
	},

	get: function(key) {
		return this.state.settings[key] || '';
	},

	restartGame: function(e) {
		this.props.events.newGame(e);
		this.close();
	},

	render: function() {
		return (
			<Modal show={this.state.showModal} onHide={this.close}>
				<Modal.Header closeButton>
					<Modal.Title>{Helper.getMessage(this.props.game)}</Modal.Title>
				</Modal.Header>
				<Modal.Footer>
					<Button bsStyle="primary" onClick={this.restartGame}>Restart Game</Button>
					<Button onClick={this.close}>Close</Button>
				</Modal.Footer>
			</Modal>
		);
	}
});



'use strict';
const React = require('react');
const SettingsModal = require('./settings-modal');
const EndOfGameModal = require('./end-of-game-modal');

module.exports = React.createClass({

	render: function() {
		return (
		<div>
			<SettingsModal settings={this.props.settings} events={this.props.events} ref={c => this.settingsModal = c}  />
			<EndOfGameModal game={this.props.game} settings={this.props.settings} events={this.props.events} ref={c => this.endOfGameModal = c} />
		</div>
		);
	}

});


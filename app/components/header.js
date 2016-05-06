'use strict';
const React = require('react');
const Helper = require('../libs/connect4-helper');

module.exports = React.createClass({

	get: function(key) {
		return this.props.settings[key] || '';
	},

	render: function() {
		var game = this.props.game, p = game.getNextPlayerId();
		return (
			<div id="board-container">
				<table>
					<tbody>
						<tr>
							<td>
								<svg id="nextPlayerIndicator" width="40" height="50">
									<circle cx="18" cy="30" r="18" fill={this.get('playerFills')[p]}></circle>
								</svg>
							</td>
							<td className="messageCell">
								<h2 id="message">{Helper.getMessage(game)}</h2>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
});
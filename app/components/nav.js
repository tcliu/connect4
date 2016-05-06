'use strict';
const React = require('react');

module.exports = React.createClass({

	render: function() {
		return (
		<nav className="navbar navbar-inverse navbar-fixed-top">
			<div className="container-fluid">
				<div className="navbar-header">
					<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
						<span className="sr-only">Toggle navigation</span>
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>
					</button>
					<a className="navbar-brand" href="#">Connect 4</a>
				</div>
				<div id="navbar" className="navbar-collapse collapse">
					<ul className="nav navbar-nav">
						<li id="newGame">
							<a href="#" onClick={this.props.events.newGame}>New Game</a>
						</li>
						<li id="settings">
							<a href="#" onClick={this.props.events.openSettings}>Settings</a>
						</li>
					</ul>
				</div>
			</div>
		</nav>
		);
	}
});

'use strict';
const React = require('react');

module.exports = React.createClass({

	playSound: function(audioId) {
		var audio = document.getElementById(audioId + '-sound');
		if (audio && audio.play) {
			audio.play();
		}
	},
	
	render: function() {
		return (
			<div>
				<audio id="drop-piece-sound">
					<source src="audio/drop-piece.wav" type="audio/wav" />
				  	<source src="https://raw.githubusercontent.com/tcliu/connect4/master/audio/drop-piece.wav" type="audio/wav" />
				</audio>
				<audio id="win-sound">
					<source src="audio/win.mp3" type="audio/mpeg" />
					<source src="https://raw.githubusercontent.com/tcliu/connect4/master/audio/win.mp3" type="audio/mpeg" />
				</audio>
			</div>
		);
	}

});

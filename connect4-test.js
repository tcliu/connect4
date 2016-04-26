'use strict';

const Connect4 = require('./app/libs/connect4');


function test() {
	var game = Object.create(Connect4).init();
	game.dropPiece(0);
	game.dropPiece(1);
	game.dropPiece(2);
	game.render(process.stdout);
	console.log(game);
}

test()
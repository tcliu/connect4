'use strict';

if (typeof Connect4 === 'undefined') {
	Connect4 = require('libs/connect4');
}
if (typeof Connect4UI === 'undefined') {
	Connect4UI = require('libs/connect4-ui');
}

var app = angular.module('connect4-app', []);

app.controller('connect4-controller', ['$scope', ($scope) => {
	
	$scope.playerCount = 1;
	$scope.playerNames = ['Player 1'];
	$scope.availablePlayerCounts = [1, 2];
	$scope.difficulty = 2;
	$scope.difficultyLabels = ['Easy', 'Moderate', 'Hard'];
	$scope.rows = Connect4.rows;
	$scope.cols = Connect4.cols;
	$scope.soundOption = 0;
	$scope.soundOptionLabels = ['On', 'Off'];
	$scope.boardFill = Connect4UI.boardFill;
	$scope.playerFill = Connect4UI.playerFill;

	$scope.newGame = () => {
		if ($scope.gameUI) {
			$scope.gameUI.destroy();
		}
		$scope.game = Object.create(Connect4).init({
			playerCount: $scope.playerCount,
			playerNames: $scope.playerNames,
			difficulty: $scope.difficulty,
			rows: $scope.rows,
			cols: $scope.cols
		});

		$scope.gameUI = Object.create(Connect4UI)
			.on('message', message => {
				$scope.message = message;
				$("#message").text(message);
			})
			.on('move', (move, message) => {
				$scope.playSound('drop-piece');
				if (move.winning) {
					$scope.playSound('win');
				    $('#restartGameModal').modal();
				    $('#restartGameModal').on('shown.bs.modal', function (event) {
				    	$("#restartGameMessage").text(message);
				    });
				}
			})
			.on("nextPlayer", nextPlayer => {
				$scope.nextPlayer = nextPlayer;
				d3.selectAll("#nextPlayerIndicator > circle")
				.style({
					fill: $scope.playerFill[$scope.nextPlayer]
				});
			})
			.init({
				game: $scope.game,
				container: '#board-container',
				boardFill: $scope.boardFill,
				playerFill: $scope.playerFill
			});
	};

	$scope.changePlayerCount = () => {
		for (var i=0; i<$scope.playerCount; i++) {
			if (!$scope.playerNames[i]) {
				$scope.playerNames[i] = `Player ${i+1}`;
			}
		}
	};

	$scope.initBoardColourPicker = () => {
		$('.board-colour-input').colorpicker().on('changeColor', function(e) {
			$scope.$apply(() => {
				$scope.boardFill = e.color.toHex();
			});
		});
	};

	$scope.initPlayerColourPicker = (idx) => {
		$('.player-colour-input:eq(' + idx + ')').colorpicker().on('changeColor', function(e) {
			$scope.$apply(() => {
				$scope.playerFill[idx] = e.color.toHex();
			});
		});
	};

	$scope.getPlayerNameLabel = (idx) => idx == 1 && $scope.playerCount == 1 ? 'Computer' : `Player ${idx + 1}`;

	$scope.playSound = (audioId) => {
		if ($scope.soundOption == 0) {
			var audio = document.getElementById(audioId + '-sound');
			if (audio && audio.play) {
				audio.play();
			}
		}
	}

	$scope.newGame();


}]);

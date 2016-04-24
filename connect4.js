'use strict';

var app = angular.module('connect4-app', []);

app.controller('connect4-controller', ['$scope', ($scope) => {
	
	$scope.playerCount = 1;
	$scope.playerNames = ['Player 1'];
	$scope.availablePlayerCounts = [1, 2];
	$scope.difficulty = 2;
	$scope.difficultyLabels = ['Easy', 'Moderate', 'Hard'];
	$scope.rows = Connect4.defaultConfig.rows;
	$scope.cols = Connect4.defaultConfig.cols;
	$scope.soundOption = 0;
	$scope.soundOptionLabels = ['On', 'Off'];
	$scope.boardFill = Connect4UI.defaultConfig.boardFill;
	$scope.playerFill = Connect4UI.defaultConfig.playerFill;

	$scope.newGame = () => {
		if ($scope.gameUI) {
			$scope.gameUI.destroy();
		}
		$scope.game = new Connect4({
			playerCount: $scope.playerCount,
			playerNames: $scope.playerNames,
			difficulty: $scope.difficulty,
			rows: $scope.rows,
			cols: $scope.cols
		});

		$scope.gameUI = new Connect4UI($scope.game, {
			container: '#board-container',
			boardFill: $scope.boardFill,
			playerFill: $scope.playerFill
		}).on('message', message => {
			$scope.message = message;
			$("#message").text(message);
		}).on('move', (move, message) => {
			$scope.playSound('drop-piece');
			if (move.winning) {
				$scope.playSound('win');
			    $('#restartGameModal').modal();
			    $('#restartGameModal').on('shown.bs.modal', function (event) {
			    	$("#restartGameMessage").text(message);
			    });
			}
		}).on("nextPlayer", nextPlayer => {
			$scope.nextPlayer = nextPlayer;
			d3.selectAll("#nextPlayerIndicator > circle")
			.style({
				fill: $scope.playerFill[$scope.nextPlayer]
			});
		});
		$scope.gameUI.initialize();
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

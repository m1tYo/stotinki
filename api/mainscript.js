/* GLOBAL VARIABLES */

var game = new Game();
var player = new Player();

/* END GLOBAL VARIABLES */

function resetHelpers() {
	if(player.helper50Used) {
		$("#clue50").attr("onclick", "help('50')").css("background-position", "0px -200px").hover(function() {
			$(this).css("background-position", "-100px -200px");
		}, function() {
			$(this).css("background-position", "0px -200px");
		});
	}
}

function help(helperType) {
	switch(helperType) {
		case "call":
			player.helperCall(game.questionSet.set[player.diffPos].correctAns);
			break;
		case "50":
			player.helper50(game.questionSet.set[player.diffPos].correctAns);
			console.log(player);
			break;
		case "public":	
			player.helperPublic(game.questionSet.set[player.diffPos].correctAns);
			break;
	}
}

function manageAttribute(action, htmlObject, attr, value) {
	switch(action) {
		case "remove":
			$(htmlObject).removeAttr(attr);
			break;
		case "set":
			$(htmlObject).attr(attr, value);		
			break;
	}
}

function quitGame() {
	player.endGame = "quit";
	$("#stinkiQuantity").text(player.currSum + " стинки!");
	$("#gameOverMessage").fadeIn('fast');
	manageAttribute("remove", "answers li a, #quitGame", "onclick", "");
	game.gameOver(game.questionSet.set[player.diffPos].correctAns, player.endGame);
}

function answer(event) {
	player.selAnswer = $(event.target).attr("choice");

	if(game.correctAnswer(game.questionSet.set[player.diffPos].correctAns, player.selAnswer)) {
		manageAttribute("remove", "#answers li a", "onclick", "");

		$("#questionImage").fadeOut("fast", function() {
			$("#correctImage").fadeIn("fast");
			setTimeout(function() {
				$("#prizes li:nth-child(" + player.currQuestionPos + ")").css("background-image", "");
				player.currQuestionPos--;
				player.diffPos++;

				if(player.currQuestionPos == 10) {
					player.diffPos = 0;
					player.diff = "normal";
					player.safeSum = $("#prizes ul li:nth-child(" + (player.currQuestionPos+1) + ") span").text();
					game.questionSet = game.getQuestionSet(player.diff);
				} else if(player.currQuestionPos == 5) {
					player.diffPos = 0;
					player.diff = "hard";
					player.safeSum = $("#prizes ul li:nth-child(" + (player.currQuestionPos+1) + ") span").text();
					game.questionSet = game.getQuestionSet(player.diff);
				} else if(player.currQuestionPos == 0) {
					player.win = true;
					player.safeSum = $("#prizes ul li:nth-child(" + (player.currQuestionPos+1) + ") span").text();
					manageAttribute("remove", "id", "#quitGame", "onclick", "");
				}

				player.questionUp(player.currQuestionPos);

				if(!player.win) game.setQuestion(player.diffPos);
			}, 2000);
		});
		
		if(!player.win) {
			setTimeout(function() {
				$("#correctImage").fadeOut("fast", function() {
					$("#questionImage").fadeIn("fast");
				});
				manageAttribute("set", "#answers li a", "onclick", "answer(event)");
			}, 2000);
		}

	} else { // if wrong answer
		$("#questionImage").fadeOut('fast', function() {
			$("#stinkiQuantity").text(player.safeSum + " стинки!");
			$("#wrongImage, #gameOverMessage").fadeIn('fast');
		});

		manageAttribute("remove", "#answers li a, #quitGame", "onclick", "");
		player.endGame = "lose";
		game.gameOver(game.questionSet.set[player.diffPos].correctAns, player.endGame);
	}
}

function resetPlayerStats() {
	player.currQuestionPos = 15;
	player.diffPos = 0;
	player.safeSum = "0";
	player.questionUp(player.currQuestionPos);
	player.diff = "easy";
	player.win = false;
	player.helperCallUsed = false;
	player.helper50Used = false;
	player.helperPublicUsed = false;
}

function startGame() {
	$("#questionArea, #answers").fadeIn("fast");

	resetPlayerStats();

	game.questionSet = game.getQuestionSet('easy');
	game.setQuestion(player.diffPos);
}

function newGame() {
	$("#wrongImage").fadeOut('fast', function() {
		$("#questionImage").fadeIn('fast');
		$("#prizes li:nth-child(" + player.currQuestionPos + ")").css("background-image", "");

		manageAttribute("set", "#answers li a", "onclick", "answer(event)");

		$("#answers li a").css({"background-color" : "#386C12", "border" : "2px solid #284513"}).hover(function() {
			$(this).css({"background-color" : "#284513", "border" : "2px solid #284513"});
		}, function() {
			$(this).css({"background-color" : "#386C12", "border" : "2px solid #284513"});
		});

		$("#newGame, #gameOverMessage").css("display", "none");
		$("#question").fadeIn('fast');

		manageAttribute("set", "#quitGame", "onclick", "quitGame()");
		if(player.win) {
			$("#winImage").css("display", "none");
		}
		resetHelpers();
		startGame();
	});
}

$(document).ready(function() {

	$("#startButton").click(function() {
		$("#startScreen").fadeOut("slow", function() {
			$("#game").fadeIn("slow", function() {
				startGame();
			});
		});
	});

});
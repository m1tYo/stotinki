/* GLOBAL VARIABLES */

var game = new Game();
var player = new Player();

/* END GLOBAL VARIABLES */

function changeDifficulty(nextDiff) {
	player.diffPos = 0;
	player.diff = nextDiff;
	player.safeSum = $("#prizes ul li:nth-child(" + (player.currQuestionPos+1) + ") span").text();
	game.questionSet = game.getQuestionSet(player.diff);
}

function help(helperType) {
	var correctAns = $("#correctAns").text();
	switch(helperType) {
		case "call":
			player.helperCall(correctAns);
			break;
		case "50":
			player.helper50(correctAns);
			break;
		case "public":	
			player.helperPublic(correctAns);
			break;
	}
}

function quitGame() {
	var correctAns = $("#correctAns").text();
	player.endGame = "quit";
	$("#stinkiQuantity").text(player.currSum + " стинки!");
	$("#gameOverMessage").fadeIn('fast');
	manageAttribute("remove", "#answers li a, #quitGame", "onclick", "");
	game.gameOver(correctAns, player.endGame);
}

function answer(event) {
	player.selAnswer = $(event.target).attr("choice");
	var correctAns = $("#correctAns").text();

	if(game.correctAnswer(correctAns, player.selAnswer)) { //if correct answer
		manageAttribute("remove", "#answers li a", "onclick", "");

		$("#questionImage").fadeOut("fast", function() {
			$("#correctImage").fadeIn("fast");
			setTimeout(function() {
				$("#prizes li:nth-child(" + player.currQuestionPos + ")").css("background-image", "");
				player.currQuestionPos--;
				player.diffPos++;

				if(player.currQuestionPos == 10) {
					changeDifficulty("normal");
				} else if(player.currQuestionPos == 5) {
					changeDifficulty("hard");
				} else if(player.currQuestionPos == 0) { // win!
					player.win = true;
					player.safeSum = $("#prizes ul li:nth-child(" + (player.currQuestionPos+1) + ") span").text();
					manageAttribute("remove", "#quitGame", "onclick", "");
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
		game.gameOver(correctAns, player.endGame);
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

	player.helper50UsedAtPos = null;
	player.helperPublicUsedAtPos = null;
	player.helperCallUsedAtPos = null;
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

		//RESET HELPERS (IF SET) SECTION

		var arrHTMLIds = ["#clue50", "#cluePublic", "#clueCall"],
			 arrDefBgPos = ["0px -200px", "0px -100px", "0px 0px"],
			 arrHoverBgPos = ["-100px -200px", "-100px -100px", "-100px 0px"];

		for(var i=0; i<3; i++) {
			resetHelper(arrHTMLIds[i], arrDefBgPos[i], arrHoverBgPos[i]);
		}

		if(player.helper50Used) {
			removeHelperData("50");
		}
		if(player.helperPublicUsed) {
			removeHelperData("public");
		}

		//END RESET HELPERS SECTION
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
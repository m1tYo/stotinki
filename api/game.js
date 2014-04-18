function Game() {
	var jsonURL = null;
	var json = null;

	this.questionSet;

	this.getQuestionSet = function(difficulty) {
		switch(difficulty) {
			case 'easy':
				jsonURL = "api/questions/easy.json";
				break;
			case 'normal':
				jsonURL = "api/questions/normal.json";
				break;
			case 'hard':
				jsonURL = "api/questions/hard.json";
				break;
		}
		$.ajax({
			'async' : false, 
			'global' : false, 
			'url' : jsonURL, 
			'dataType' : "json", 
			'success' : function(data) {
				json = data;
			}
		});
		return json;
	}

	this.setQuestion = function(diffPos)  {
		$.each(this.questionSet.set[diffPos], function(key, value){
			$("#"+ key).text(value);
		});
	}

	this.correctAnswer = function(correctAns, playerAns) {
		if(correctAns == playerAns) return true;
		else return false;
	}

	this.gameOver = function(correctAns, endGame) {
		if(endGame == "lose") {
			$("#questionArea #question").fadeOut('fast', function() {
				$("#newGame").fadeIn('fast');	
			});
		} else { 
			$("#newGame").fadeIn('fast');
		}
	
		$("#answers li:nth-child(" + correctAns + ") a").css({"background-color" : "#E14C4C", "border" : "2px solid #970F00"});
	}
}

function Player() {

	this.selAns;
	this.currQuestionPos;
	this.endGame;
	this.currSum;
	this.safeSum;
	this.diff;
	this.diffPos;
	this.win = false;

	this.helper50Used = false;
	this.helperCallUsed = false;
	this.helperPublicUsed = false;

	// variables to store data when 50/50 is used
	this.helper50UsedAtPos;
	this.helper50Wrong1;
	this.helper50Wrong2;

	this.questionUp = function(pos) {
		if(pos >= 1) {
			$("#prizes li:nth-child(" + pos + ")").css("background-image", "url('images/prize-pointer.png')");
			this.currSum = $("#prizes ul li:nth-child(" + (pos+1) + ") span").text();
		} else {
			$("#imageStateContainer img").css("display", "none");
			$("#winImage").fadeIn('fast');

			$("#questionArea #question, #questionArea #answers").css("display", "none");
			$("#newGame").fadeIn('fast');

			$("#stinkiQuantity").text(player.safeSum + " стинки!");
			$("#gameOverMessage").fadeIn('fast');
		}
	}

	this.helper50 = function(correctAns) {
		var arrWrongAns = [0, 0];
		var nRandom = Math.floor(Math.random()*4+1);

		for(var i=0; i<2; i++) {
			while($.inArray(nRandom, arrWrongAns) != -1 || nRandom == correctAns) {
				nRandom = Math.floor(Math.random()*4+1);
			}
			arrWrongAns[i] = nRandom;
			$("#answers li:nth-child(" +  arrWrongAns[i] + ") a").text(" ").removeAttr("onclick").attr("empty", "1");
		}

		$("#clue50").css("background-position", "-200px -200px").removeAttr("onclick").off();

		this.helper50Wrong1 = arrWrongAns[0];
		this.helper50Wrong2 = arrWrongAns[1];
		this.helper50Used = true;
		this.helper50UsedAtPos = this.currQuestionPos;
	}

	this.helperPublic = function(correctAns) {
		var arrAnsLabels = ["A", "B", "C", "D"];
		var fullPercentage = 100;
		var arrAnsPerc = [-1, -1, -1, -1];
		
		// get most probable value
		switch(this.diff) {
			case "easy":
				arrAnsPerc[correctAns-1] = Math.floor(Math.random()*50+50);
				break;
			case "normal":
				arrAnsPerc[correctAns-1] = Math.floor(Math.random()*40+40);
				break;
			case "hard":
				arrAnsPerc[correctAns-1] = Math.floor(Math.random()*20+20);
				break;
		}
		fullPercentage -= arrAnsPerc[correctAns-1];

		// show whole div that stores the columns
		$("#helperDataPublicAllElements").fadeIn('fast', function() {
			$("#helperDataPublicLabelsContainer p").fadeIn('fast');
		});

		if((this.helper50Used == true) && (this.helper50UsedAtPos == this.currQuestionPos)) {
			arrAnsPerc[this.helper50Wrong1-1] = 0;
			arrAnsPerc[this.helper50Wrong2-1] = 0;
			for(var i=0; i<4; i++) {
				if(arrAnsPerc[i] == -1) {
					arrAnsPerc[i] = Math.floor(fullPercentage);
				}
			}
		} else { //if without 50/50 used
			for(var i=0; i<4; i++) {
				if(arrAnsPerc[i] == -1) {
					arrAnsPerc[i] = Math.floor(Math.random()*fullPercentage);
					fullPercentage -= arrAnsPerc[i];
				}
			}
		}

		for(var i=0; i<4; i++) {
			$("#helperDataPublicLabelsContainer p:nth-child(" + (i+1) + ")").text(arrAnsLabels[i]+"("+arrAnsPerc[i]+"%)").animate({bottom : arrAnsPerc[i]*2+"px"});
			$("#helperDataPublicColumns div:nth-child("+(i+1)+")").animate({height : (arrAnsPerc[i]*2+"px")});
		}

	$("#clueHelp").css("background-position", "-200px -100px").removeAttr("onclick").off();

	this.helperPublicUsed = true;
	}
}
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

function disableHelper(helper) {
	$(helper).css("background-position-x", "-=100px");
	manageAttribute("remove", helper, "onclick", "");
	$(helper).unbind('mouseenter mouseleave');
}

function resetHelper(htmlID, defaultBgPos, hoverBgPos) {
	var helpFunction;
	switch(htmlID) {
		case "#clue50":
			helpFunction = "help('50')";
			break;
		case "#cluePublic":
			helpFunction = "help('public')";
			break;
		case "#clueCall":
			helpFunction = "help('call')";
			break;
	}

	$(htmlID).attr("onclick", helpFunction).css("background-position", defaultBgPos).hover(function() {
		$(this).css("background-position", hoverBgPos);
	}, function() {
		$(this).css("background-position", defaultBgPos);
	});

	if(helpFunction === "help('50')") {
		$("#answers li a").attr("empty", "0");
	}
}

function removeHelperData(helper) {
	if(helper == '50') {
		$("#answers li a").attr("empty", "0");
	} else if(helper == 'public') {
		$("#helperDataPublicAllElements").fadeOut('fast');
	} else {
		$("#helperCallElements").fadeOut('fast');
	}
}
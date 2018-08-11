debug.log('button.js');

$('#button-up').click(function(){
	game.movePlayerUp();
	return false;
});

$('#button-down').click(function(){
	game.movePlayerDown();
	return false;
});

$('#button-left').click(function(){
	game.movePlayerLeft();
	return false;
});

$('#button-right').click(function(){
	game.movePlayerRight();
	return false;
});
		

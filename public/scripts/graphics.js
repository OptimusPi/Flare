debug.log("graphics.js");

var graphics = {

	//screen dimensions
	screenWidth: 960,
	screenHeight: 640,
	app: {},

	//game objects (also sprites!)
	player: null,
	beam: null,

	//game sprites
	ship: null,
	shipBoosting1: null,
	shipBoosting2: null,
	shipBoosting3: null,

	//mobile controls
	mobileMode: true,
	leftArrow: null,
	rightArrow: null,
	upArrow: null,
	downArrow: null,
	flareButton: null,
	volumeSlider: null,
	volumeLine: null,

	addPlayer: function(x, y) {

		//create player base, then add a sprite to it.
		var player = { sprite: null, battery: 100 };

		// create new sprite TOO make it from the image textures loaded in
		player.sprite = new PIXI.Sprite(this.ship.texture);
		
		//add sprite to player
		player.sprite = ship;
		player.sprite.x = x;
		player.sprite.y = y;

		//add sprite to the screen.
		this.app.stage.addChild(player.sprite);

		//Add GUI
		this.addGUI();

		this.player = player;
	},

	setPlayerSprite: function(player, newSprite){
		player.sprite.texture = newSprite.texture;
	},

	movePlayer: function(x, y) {
		//move the player's ship on screen
		this.players[i].sprite.x = x;
		this.players[i].sprite.y = y;
	},

	removeGUI: function(){
		this.app.stage.removeChild(this.leftArrow);
		this.app.stage.removeChild(this.rightArrow);
		this.app.stage.removeChild(this.upArrow);
		this.app.stage.removeChild(this.downArrow);	
		this.app.stage.removeChild(this.flareButton);	
		this.app.stage.removeChild(this.volumeSlider);
		this.app.stage.removeChild(this.volumeLine);
	},

	addGUI: function(){
		this.app.stage.addChild(this.leftArrow);
		this.app.stage.addChild(this.rightArrow);
		this.app.stage.addChild(this.upArrow);
		this.app.stage.addChild(this.downArrow);	
		this.app.stage.addChild(this.flareButton);
		this.app.stage.addChild(this.volumeLine);
		this.app.stage.addChild(this.volumeSlider);		
	},

	runOverworld: function(){
		this.addPlayer(352, 800);

		if (this.mobileMode)
			this.addGUI();
	},

	start: function(){
		var type = "WebGL";
		if(!PIXI.utils.isWebGLSupported()){
			type = "canvas";
		}
		PIXI.utils.sayHello(type);

		this.app = new PIXI.Application(this.screenWidth, this.screenHeight, {backgroundColor : this.backgroundColor});

		console.log(document);
		console.log(document.body);

		document.getElementById('content').appendChild(this.app.view);

		//TODO: determine if mobile or not
		this.mobileMode = true;

		PIXI.loader
		.add({name: 'beam', url: 'images/beam.png'})
		.add({name: 'ship', url: 'images/ship.png'})
		.add({name: 'shipBoosting1', url: 'images/shipBoosting1.png'})
		.add({name: 'shipBoosting2', url: 'images/shipBoosting2.png'})
		.add({name: 'shipBoosting3', url: 'images/shipBoosting3.png'})
		.add({name: 'leftArrow', url: 'images/GUI/left_arrow.png'})
		.add({name: 'rightArrow', url: 'images/GUI/right_arrow.png'})
		.add({name: 'upArrow', url: 'images/GUI/up_arrow.png'})
		.add({name: 'downArrow', url: 'images/GUI/down_arrow.png'})
		.add({name: 'flareButton', url: 'images/GUI/flare_button.png'})
		.add({name: 'volumeLine', url: 'images/GUI/volume_line.png'})
		.add({name: 'volumeSlider', url: 'images/GUI/volume_slider.png'})	
		.load(function (){
			//Load player ship
			var shipTexture = new PIXI.Texture(PIXI.loader.resources.ship.texture);
			graphics.ship =  new PIXI.Sprite(shipTexture);

			var shipBoosting1Texture = new PIXI.Texture(PIXI.loader.resources.ship.texture);
			graphics.shipBoosting1 =  new PIXI.Sprite(shipBoosting1Texture);

			var shipBoosting2Texture = new PIXI.Texture(PIXI.loader.resources.ship.texture);
			graphics.shipBoosting2 =  new PIXI.Sprite(shipBoosting2Texture);

			var shipBoosting3Texture = new PIXI.Texture(PIXI.loader.resources.ship.texture);
			graphics.shipBoosting3 =  new PIXI.Sprite(shipBoosting3Texture);

			var beamTexture = new PIXI.Texture(PIXI.loader.resources.beam.texture);
			graphics.beam =  new PIXI.Sprite(beamTexture);

			//D-pad and flare button for mobile on-screen controls
			graphics.leftArrow  = new PIXI.Sprite(PIXI.loader.resources.leftArrow.texture);
			graphics.rightArrow = new PIXI.Sprite(PIXI.loader.resources.rightArrow.texture);
			graphics.upArrow    = new PIXI.Sprite(PIXI.loader.resources.upArrow.texture);
			graphics.downArrow  = new PIXI.Sprite(PIXI.loader.resources.downArrow.texture);
			graphics.flareButton  = new PIXI.Sprite(PIXI.loader.resources.flareButton.texture);
			graphics.volumeLine = new PIXI.Sprite(PIXI.loader.resources.volumeLine.texture);
			graphics.volumeSlider = new PIXI.Sprite(PIXI.loader.resources.volumeSlider.texture);

			graphics.init();
		});
	},

	init: function() {
		// GUI elements
		this.volumeLine.x = 50;
		this.volumeLine.y = 16;
		this.volumeSlider.x = 150;
		this.volumeSlider.y = 8;
		this.leftArrow.x = 50;
		this.leftArrow.y = 410;
		this.rightArrow.x = 250;
		this.rightArrow.y = 410;
		this.upArrow.x = 150;
		this.upArrow.y = 310;
		this.downArrow.x = 150;
		this.downArrow.y = 510;
		this.flareButton.x = 150;
		this.flareButton.y = 410;
		this.leftArrow.interactive = true;
		this.leftArrow.buttonMode = true;
		this.rightArrow.interactive = true;
		this.rightArrow.buttonMode = true;
		this.upArrow.interactive = true;
		this.upArrow.buttonMode = true;
		this.downArrow.interactive = true;
		this.downArrow.buttonMode = true;
		this.flareButton.interactive = true;
		this.flareButton.buttonMode = true;
		this.leftArrow.on('pointerdown', game.movePlayerLeft);	
		this.rightArrow.on('pointerdown', game.movePlayerRight);	
		this.upArrow.on('pointerdown', game.movePlayerUp);	
		this.downArrow.on('pointerdown', game.movePlayerDown);	
		this.flareButton.on('pointerdown', game.fireFlare); //TODO

		//Auto resize window
		layout.addListeners();
		layout.resizeCanvas();

		//Start the game!
		game.init();
		game.runOverworld(); //TODO add main menu
	}
};

var layout = {    
   ratio: graphics.screenWidth/graphics.screenHeight,
			   
   resizeCanvas: function(){
	var content = $('#content');
	var w = content.width();
	var h = content.height();
	  

	//Landscape
	if (w / h >= layout.ratio) {
		w = h * layout.ratio;
		h = h;
	} 
	//Portrait
	else {
		w = w;
		h = w / layout.ratio;
	}
 
	//Resize game
	debug.log("resize to w:" + w + " h: " + h);
	graphics.app.renderer.view.style.width = w + 'px';
	graphics.app.renderer.view.style.height = h + 'px';
},

addListeners: function(){
	//Scale game to fit perfectly as the user resizes their browser window
	$(window).resize(function(){
		layout.resizeCanvas();
	});
	
	//Resize when a mobile devices switches between portrait and landscape orientation
	$(window).on( "orientationchange", function(){
		layout.resizeCanvas();
	});
}};

graphics.start();
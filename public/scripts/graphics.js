debug.log("graphics.js");

var graphics = {

	//screen dimensions
	screenWidth: 960,
	screenHeight: 640,
	app: {},

	//game sprites
	batteryLife: null,
	space: null,
	stars: [],
	starTexture: [],
	wallLeft: null,
	wallRight: null,

	//Text
	gameScore: null,

	//Textures
	batteryLifeTexture_100: null,
	batteryLifeTexture_75: null,
	batteryLifeTexture_50: null,
	batteryLifeTexture_25: null,
	batteryLifeTexture_0: null,
	powerupTexture: null,
	shipBoostingTexture1: null,
	shipBoostingTexture2: null,
	shipBoostingTexture3: null,
	shipTexture: null,
	shipPart1Texture: null,
	shipPart2Texture: null,
	shipPart3Texture: null,
	shipPart4Texture: null,
	beamTexture: null,
	
	//mobile controls
	mobileMode: true,
	leftArrow: null,
	rightArrow: null,
	upArrow: null,
	downArrow: null,
	flareButton: null,
	volumeSlider: null,
	volumeLine: null,

	addSpace: function() {
		//this.app.stage.addChild(this.space);
		for (var i = 0; i < 200; i++) {
			var x = Math.random() * 960 % 960;
			var y = Math.random() * 640 % 640;
			var ySpeed = Math.random() * 1000 % 3;
			ySpeed *= 0.04 + 1.1;

			var img = Math.ceil(Math.random() * 20) - 1;

			var star = { 
				sprite: new PIXI.Sprite(this.starTexture[img]), 
				ySpeed: ySpeed * 0.04 + 1.1
			}; 
			star.sprite.x = x;
			star.sprite.y = y;
			this.app.stage.addChild(star.sprite);
			this.stars.push(star);
		}
	},
	addWalls: function() {
		this.wallLeft.x = -500;
		this.wallLeft.y = 0;
		this.app.stage.addChild(this.wallLeft);

		this.wallRight.x = 950;
		this.wallRight.y = 0;
		this.app.stage.addChild(this.wallRight);

		game.wallLeft = {sprite: this.wallLeft, xSpeed: 0.03};
		game.wallRight = {sprite: this.wallRight, xSpeed: -0.03};
		
	},
	addPlayer: function(x, y) {

		//create player base, then add a sprite to it.
		var player = game.player;

		// create new sprite TOO make it from the image textures loaded in
		player.sprite = new PIXI.Sprite(this.shipTexture);
		
		//add sprite to player
		player.sprite.x = x;
		player.sprite.y = y;
		game.player = player;

		//add sprite to the screen.
		this.app.stage.addChild(game.player.sprite);
	},

	removeGUI: function(){
		this.app.stage.removeChild(this.leftArrow);
		this.app.stage.removeChild(this.rightArrow);
		this.app.stage.removeChild(this.upArrow);
		this.app.stage.removeChild(this.downArrow);	
		this.app.stage.removeChild(this.flareButton);	
		this.app.stage.removeChild(this.volumeSlider);
		this.app.stage.removeChild(this.volumeLine);
		this.app.stage.removeChild(this.batteryLife);
	},

	addGUI: function(){
		this.app.stage.addChild(this.leftArrow);
		this.app.stage.addChild(this.rightArrow);
		this.app.stage.addChild(this.upArrow);
		this.app.stage.addChild(this.downArrow);	
		this.app.stage.addChild(this.flareButton);
		this.app.stage.addChild(this.volumeLine);
		this.app.stage.addChild(this.volumeSlider);		
		this.app.stage.addChild(this.batteryLife);
		this.app.stage.addChild(this.gameScore);
	},

	runOverworld: function(){
		this.addSpace();
		this.addWalls();
		this.addPlayer(512, 512);

		if (this.mobileMode)
			this.addGUI();
	},

	animateStars: function (deltaTime) {
		graphics.stars.forEach(star => { 
			star.sprite.y += star.ySpeed * deltaTime;
			if (star.sprite.y > 640) {
				star.sprite.y = -star.sprite.height;
				star.sprite.x = Math.random() * 960 % 960;
			}
		});
	},

	addBeam: function() {
		var beamSprite = new PIXI.Sprite(graphics.beamTexture);
		beamSprite.x = game.player.sprite.x + game.player.sprite.width / 2 - this.beamTexture.width/2;
		beamSprite.y = game.player.sprite.y;
		graphics.app.stage.addChild(beamSprite);

		var beam = { sprite: beamSprite, ySpeed: -10};
		game.beams.push(beam);
	},

	addPowerup: function() {
		var powerupSprite = new PIXI.Sprite(graphics.powerupTexture);
		powerupSprite.x = game.player.sprite.x + game.player.sprite.width / 2 - this.powerupTexture.width / 2;
		powerupSprite.y = 0;
		graphics.app.stage.addChild(powerupSprite);

		var powerup = { sprite: powerupSprite, ySpeed: 5};
		game.powerups.push(powerup);
	},

	start: function() {
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
		.add({name: 'star1', url: 'images/star1.png'})
		.add({name: 'star2', url: 'images/star2.png'})
		.add({name: 'star3', url: 'images/star3.png'})
		.add({name: 'star4', url: 'images/star4.png'})
		.add({name: 'star5', url: 'images/star5.png'})
		.add({name: 'star6', url: 'images/star6.png'})
		.add({name: 'star7', url: 'images/star7.png'})
		.add({name: 'star8', url: 'images/star8.png'})
		.add({name: 'star9', url: 'images/star9.png'})
		.add({name: 'star10', url: 'images/star10.png'})
		.add({name: 'beam', url: 'images/beam.png'})
		.add({name: 'ship', url: 'images/ship.png'})
		.add({name: 'shipPart1', url: 'images/ship_part1.png'})
		.add({name: 'shipPart2', url: 'images/ship_part2.png'})
		.add({name: 'shipPart3', url: 'images/ship_part3.png'})
		.add({name: 'shipPart4', url: 'images/ship_part4.png'})
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
		.add({name: 'batteryLife_100', url: 'images/GUI/battery_100.png'})
		.add({name: 'batteryLife_75', url: 'images/GUI/battery_75.png'})
		.add({name: 'batteryLife_50', url: 'images/GUI/battery_50.png'})
		.add({name: 'batteryLife_25', url: 'images/GUI/battery_25.png'})
		.add({name: 'batteryLife_0', url: 'images/GUI/battery_0.png'})	
		.add({name: 'battery', url: 'images/battery.png'})
		.add({name: 'wallLeft', url: 'images/wall_left.png'})
		.add({name: 'wallRight', url: 'images/wall_right.png'})
		
		.load(function (){
			//Load walls
			graphics.wallLeft =  new PIXI.Sprite(PIXI.loader.resources.wallLeft.texture);
			graphics.wallRight =  new PIXI.Sprite(PIXI.loader.resources.wallRight.texture);

			//Load stars
			graphics.starTexture[0] = new PIXI.Texture(PIXI.loader.resources.star1.texture);
			graphics.starTexture[1] = new PIXI.Texture(PIXI.loader.resources.star2.texture);
			graphics.starTexture[2] = new PIXI.Texture(PIXI.loader.resources.star3.texture);
			graphics.starTexture[3] = new PIXI.Texture(PIXI.loader.resources.star4.texture);
			graphics.starTexture[4] = new PIXI.Texture(PIXI.loader.resources.star5.texture);
			graphics.starTexture[5] = new PIXI.Texture(PIXI.loader.resources.star6.texture);
			graphics.starTexture[6] = new PIXI.Texture(PIXI.loader.resources.star7.texture);
			graphics.starTexture[7] = new PIXI.Texture(PIXI.loader.resources.star8.texture);
			graphics.starTexture[7] = new PIXI.Texture(PIXI.loader.resources.star9.texture);
			graphics.starTexture[9] = new PIXI.Texture(PIXI.loader.resources.star10.texture);

			//Load player ship
			graphics.shipTexture = new PIXI.Texture(PIXI.loader.resources.ship.texture);
			graphics.shipPart1Texture = new PIXI.Texture(PIXI.loader.resources.shipPart1.texture);
			graphics.shipPart2Texture = new PIXI.Texture(PIXI.loader.resources.shipPart2.texture);
			graphics.shipPart3Texture = new PIXI.Texture(PIXI.loader.resources.shipPart3.texture);
			graphics.shipPart4Texture = new PIXI.Texture(PIXI.loader.resources.shipPart4.texture);
			graphics.shipBoosting1Texture = new PIXI.Texture(PIXI.loader.resources.shipBoosting1.texture);
			graphics.shipBoosting2Texture = new PIXI.Texture(PIXI.loader.resources.shipBoosting2.texture);
			graphics.shipBoosting3Texture = new PIXI.Texture(PIXI.loader.resources.shipBoosting3.texture);

			//laser beam on the ship
			graphics.beamTexture = new PIXI.Texture(PIXI.loader.resources.beam.texture);

			//D-pad and flare button for mobile on-screen controls
			graphics.leftArrow  = new PIXI.Sprite(PIXI.loader.resources.leftArrow.texture);
			graphics.rightArrow = new PIXI.Sprite(PIXI.loader.resources.rightArrow.texture);
			graphics.upArrow    = new PIXI.Sprite(PIXI.loader.resources.upArrow.texture);
			graphics.downArrow  = new PIXI.Sprite(PIXI.loader.resources.downArrow.texture);
			graphics.flareButton  = new PIXI.Sprite(PIXI.loader.resources.flareButton.texture);
			graphics.volumeLine = new PIXI.Sprite(PIXI.loader.resources.volumeLine.texture);
			graphics.volumeSlider = new PIXI.Sprite(PIXI.loader.resources.volumeSlider.texture);

			//Battery
			graphics.batteryLifeTexture_100 = new PIXI.Texture(PIXI.loader.resources.batteryLife_100.texture);
			graphics.batteryLifeTexture_75 = new PIXI.Texture(PIXI.loader.resources.batteryLife_75.texture);
			graphics.batteryLifeTexture_50 = new PIXI.Texture(PIXI.loader.resources.batteryLife_50.texture);
			graphics.batteryLifeTexture_25 = new PIXI.Texture(PIXI.loader.resources.batteryLife_25.texture);
			graphics.batteryLifeTexture_0 = new PIXI.Texture(PIXI.loader.resources.batteryLife_0.texture);
			graphics.batteryLife = new PIXI.Sprite(PIXI.loader.resources.batteryLife_100.texture);
			graphics.powerupTexture = new PIXI.Texture(PIXI.loader.resources.battery.texture);

			//Score
			graphics.gameScore = new PIXI.Text('SCORE: 0', {
				fontWeight: 'bold',
				fontStyle: 'italic',
				fontSize: 36,
				fontFamily: 'Arvo',
				fill: '#3e1707',
				align: 'center',
				stroke: '#a4410e',
				strokeThickness: 4
			});
			

			//Initialize graphics
			graphics.init();
			
			//TODO move this?
			//connect sprites to physics in game code
			const ticker = new PIXI.ticker.Ticker();
			ticker.stop();
			ticker.add((deltaTime) => {
				game.physics(deltaTime);
			});
			ticker.start();

			const animationTicker = new PIXI.ticker.Ticker();
			animationTicker.stop();
			animationTicker.add((deltaTime) => {
				graphics.animateStars(deltaTime);
			});
			animationTicker.start();

			
		});
	},

	init: function() {
		// GUI elements
		this.gameScore.x = 800;
		this.gameScore.y = 560;
		this.gameScore.anchor.x = 0.5;
		this.batteryLife.x = 850;
		this.batteryLife.y = 600;
		this.volumeLine.x = 50;
		this.volumeLine.y = 16;
		this.volumeSlider.x = 134;
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
		//press touch screen constrols
		this.leftArrow.on('pointerdown', game.movePlayerLeft);	
		this.rightArrow.on('pointerdown', game.movePlayerRight);	
		this.upArrow.on('pointerdown', game.movePlayerUp);	
		this.downArrow.on('pointerdown', game.movePlayerDown);	
		//release touch screen controls
		this.leftArrow.on('pointerup', game.stopPlayerLeft);	
		this.rightArrow.on('pointerup', game.stopPlayerRight);	
		this.upArrow.on('pointerup', game.stopPlayerUp);	
		this.downArrow.on('pointerup', game.stopPlayerDown);

		//shoot a flare to battle the walls
		this.flareButton.on('pointerdown', game.fireFlare);

		//Auto resize window
		layout.addListeners();
		layout.resizeCanvas();

		//Interactivity for volume slide 
		this.volumeSlider.interactive = true;
		this.volumeSlider.buttonMode = true;
		this.volumeSlider.on('pointerdown', game.onDragStart);
		this.volumeSlider.on('pointerup', game.onDragEnd);
		this.volumeSlider.on('pointerupoutside', game.onDragEnd);
		this.volumeSlider.on('pointerup', game.updateSound);
		this.volumeSlider.on('pointermove', game.onDragMove);
		//Start the game!

		var score = 0;
		this.app.ticker.add(function() {
			score = score + 0.0175;
			graphics.gameScore.text = 'SCORE: ' + Math.floor(score);
		});

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
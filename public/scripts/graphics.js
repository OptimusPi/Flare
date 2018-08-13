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
	asteroidsTexture: [],
	wallLeft: null,
	wallRight: null,

	//Text
	gameScore: null,
	batteryLabel: null,
	playLabel: null,
	playMobileLabel: null,
	gameOverLabel: null,

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
	RightFlareTexture: null,
	LeftFlareTexture: null,
	asteroidFlareTexture: null,

	//mobile controls
	mobileMode: false,
	leftArrow: null,
	rightArrow: null,
	upArrow: null,
	downArrow: null,
	flareButton: null,

	//GUI elements
	volumeSlider: null,
	volumeLine: null,
	mainMenuButton: null,
	playButton: null,
	playMobileButton: null,

	addSpace: function () {
		//this.app.stage.addChild(this.space);
		for (var i = 0; i < 200; i++) {
			var x = Math.random() * 960 % 960;
			var y = Math.random() * 640 % 640;
			var ySpeed = Math.random() * 1000 % 3;
			ySpeed *= 0.04 + 0.9;

			var img = Math.ceil(Math.random() * 20) - 1;

			var star = {
				sprite: new PIXI.Sprite(this.starTexture[img]),
				ySpeed: ySpeed * 0.04 + 0.8
			};
			star.sprite.x = x;
			star.sprite.y = y;
			this.app.stage.addChild(star.sprite);
			this.stars.push(star);
		}
	},
	addWalls: function () {
		this.wallLeft.x = -500;
		this.wallLeft.y = 0;
		this.app.stage.addChild(this.wallLeft);

		this.wallRight.x = 950;
		this.wallRight.y = 0;
		this.app.stage.addChild(this.wallRight);

		game.wallLeft = { sprite: this.wallLeft, xSpeed: 0.1 };
		game.wallRight = { sprite: this.wallRight, xSpeed: -0.1 };

	},
	addPlayer: function (x, y) {

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

	removeOverworldGUI: function () {
		if (this.mobileMode) {
			this.app.stage.removeChild(this.leftArrow);
			this.app.stage.removeChild(this.rightArrow);
			this.app.stage.removeChild(this.upArrow);
			this.app.stage.removeChild(this.downArrow);
			this.app.stage.removeChild(this.flareButton);
		}
		this.app.stage.removeChild(this.batteryLife);
	},

	addOverworldGUI: function () {
		if (this.mobileMode) {
			this.app.stage.addChild(this.leftArrow);
			this.app.stage.addChild(this.rightArrow);
			this.app.stage.addChild(this.upArrow);
			this.app.stage.addChild(this.downArrow);
			this.app.stage.addChild(this.flareButton);
		}
		this.app.stage.addChild(this.volumeLine);
		this.app.stage.addChild(this.volumeSlider);
		this.app.stage.addChild(this.batteryLife);
		this.app.stage.addChild(this.gameScore);
		this.app.stage.addChild(this.batteryLabel);
	},

	addMenuGUI: function () {
		this.app.stage.addChild(this.playButton);
		this.app.stage.addChild(this.playLabel);
		this.app.stage.addChild(this.playMobileButton);
		this.app.stage.addChild(this.playMobileLabel);
		this.app.stage.addChild(this.volumeLine);
		this.app.stage.addChild(this.volumeSlider);
	},

	removeMenuGUI: function () {
		this.app.stage.removeChild(this.playButton);
		this.app.stage.removeChild(this.playLabel);
		this.app.stage.removeChild(this.playMobileButton);
		this.app.stage.removeChild(this.playMobileLabel);
	},

	runOverworld: function (mobileMode) {
		this.removeMenuGUI();
		this.mobileMode = mobileMode;
		this.addWalls();
		this.addPlayer(512, 512);
		this.addOverworldGUI();
	},

	runMenu: function () {
		this.addSpace();
		this.addMenuGUI();
	},

	gameOver: function () {
		this.app.stage.addChild(this.gameOverLabel);
		this.app.stage.addChild(this.mainMenuButton);
		this.app.stage.addChild(this.mainMenuLabel);
	},

	removeGameOver: function () {
		this.app.stage.removeChild(this.gameOverLabel);
		this.app.stage.removeChild(this.mainMenuButton);
		this.app.stage.removeChild(this.mainMenuLabel);
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

	addFlare: function (asteroidFlare) {
		var leftFlareSprite = new PIXI.Sprite(graphics.leftFlareTexture);
		leftFlareSprite.x = asteroidFlare.sprite.x - asteroidFlare.sprite.width - this.leftFlareTexture.width / 2;
		leftFlareSprite.y = asteroidFlare.sprite.y - this.leftFlareTexture.height;
		graphics.app.stage.addChild(leftFlareSprite);
		var leftFlare = { sprite: leftFlareSprite, xSpeed: -15 };
		game.leftFlares.push(leftFlare);

		//------------

		var rightFlareSprite = new PIXI.Sprite(graphics.rightFlareTexture);
		rightFlareSprite.x = asteroidFlare.sprite.x + asteroidFlare.sprite.width - this.rightFlareTexture.width / 2;
		rightFlareSprite.y = asteroidFlare.sprite.y - this.rightFlareTexture.height;
		graphics.app.stage.addChild(rightFlareSprite);
		var rightFlare = { sprite: rightFlareSprite, xSpeed: 15 };
		game.rightFlares.push(rightFlare);
	},
	addBeam: function () {
		var beamSprite = new PIXI.Sprite(graphics.beamTexture);
		beamSprite.x = game.player.sprite.x + game.player.sprite.width / 2 - this.beamTexture.width / 2;
		beamSprite.y = game.player.sprite.y - this.beamTexture.height;
		graphics.app.stage.addChild(beamSprite);

		var beam = { sprite: beamSprite, ySpeed: -30 };
		game.beams.push(beam);
	},

	addAsteroid: function (top) {
		var asteroidSprite = new PIXI.Sprite(graphics.asteroidsTexture[0]);
		//spawn between the walls
		asteroidSprite.x = Math.random()
			* (game.wallRight.sprite.x - ((game.wallLeft.sprite.x + game.wallLeft.sprite.width)) - asteroidSprite.width * 2)
			+ game.wallLeft.sprite.x + game.wallLeft.sprite.width + asteroidSprite.width;


		if (top) asteroidSprite.y = - graphics.asteroidsTexture[0].height;
		else asteroidSprite.y = 640;

		graphics.app.stage.addChild(asteroidSprite);

		var asteroid = {
			sprite: asteroidSprite,
			ySpeed: top ? Math.random() + 1 : (Math.random() - 1) * 0.9,
			xSpeed: Math.random() * 2 - 1
		};
		game.asteroids.push(asteroid);
	},

	addAsteroidFlare: function () {
		var asteroidFlareSprite = new PIXI.Sprite(graphics.asteroidFlareTexture);
		//spawn between the walls
		asteroidFlareSprite.x = 960 / 2 - asteroidFlareSprite.width;
		asteroidFlareSprite.y = 0 - asteroidFlareSprite.height;

		graphics.app.stage.addChild(asteroidFlareSprite);

		var asteroidFlare = {
			sprite: asteroidFlareSprite,
			ySpeed: 1,
			xSpeed: 0
		};
		game.asteroidFlares.push(asteroidFlare);
	},

	addPowerup: function () {
		var powerupSprite = new PIXI.Sprite(graphics.powerupTexture);
		powerupSprite.x = game.player.sprite.x + game.player.sprite.width / 2 - graphics.powerupTexture.width / 2;
		powerupSprite.y = 0;
		graphics.app.stage.addChild(powerupSprite);

		var powerup = { sprite: powerupSprite, ySpeed: 3.14, xSpeed: (Math.random() - 0.5) * 1.5 };
		game.powerups.push(powerup);
	},

	start: function () {
		var type = "WebGL";
		if (!PIXI.utils.isWebGLSupported()) {
			type = "canvas";
		}
		PIXI.utils.sayHello(type);

		this.app = new PIXI.Application(this.screenWidth, this.screenHeight, { backgroundColor: this.backgroundColor });

		console.log(document);
		console.log(document.body);

		document.getElementById('content').appendChild(this.app.view);

		PIXI.loader
			.add({ name: 'star1', url: 'images/star1.png' })
			.add({ name: 'star2', url: 'images/star2.png' })
			.add({ name: 'star3', url: 'images/star3.png' })
			.add({ name: 'star4', url: 'images/star4.png' })
			.add({ name: 'star5', url: 'images/star5.png' })
			.add({ name: 'star6', url: 'images/star6.png' })
			.add({ name: 'star7', url: 'images/star7.png' })
			.add({ name: 'star8', url: 'images/star8.png' })
			.add({ name: 'star9', url: 'images/star9.png' })
			.add({ name: 'star10', url: 'images/star10.png' })
			.add({ name: 'asteroid1', url: 'images/asteroid1.png' })
			.add({ name: 'asteroid2', url: 'images/asteroid2.png' })
			.add({ name: 'asteroid3', url: 'images/asteroid3.png' })
			.add({ name: 'asteroid4', url: 'images/asteroid4.png' })
			.add({ name: 'beam', url: 'images/beam.png' })
			.add({ name: 'rightFlare', url: 'images/flare_right.png' })
			.add({ name: 'leftFlare', url: 'images/flare_left.png' })
			.add({ name: 'ship', url: 'images/ship.png' })
			.add({ name: 'shipPart1', url: 'images/ship_part1.png' })
			.add({ name: 'shipPart2', url: 'images/ship_part2.png' })
			.add({ name: 'shipPart3', url: 'images/ship_part3.png' })
			.add({ name: 'shipPart4', url: 'images/ship_part4.png' })
			.add({ name: 'shipBoosting1', url: 'images/shipBoosting1.png' })
			.add({ name: 'shipBoosting2', url: 'images/shipBoosting2.png' })
			.add({ name: 'shipBoosting3', url: 'images/shipBoosting3.png' })
			.add({ name: 'leftArrow', url: 'images/GUI/left_arrow.png' })
			.add({ name: 'rightArrow', url: 'images/GUI/right_arrow.png' })
			.add({ name: 'upArrow', url: 'images/GUI/up_arrow.png' })
			.add({ name: 'downArrow', url: 'images/GUI/down_arrow.png' })
			.add({ name: 'flareButton', url: 'images/GUI/flare_button.png' })
			.add({ name: 'volumeLine', url: 'images/GUI/volume_line.png' })
			.add({ name: 'volumeSlider', url: 'images/GUI/volume_slider.png' })
			.add({ name: 'menuButton', url: 'images/GUI/menu_button.png' })
			.add({ name: 'batteryLife_100', url: 'images/GUI/battery_100.png' })
			.add({ name: 'batteryLife_75', url: 'images/GUI/battery_75.png' })
			.add({ name: 'batteryLife_50', url: 'images/GUI/battery_50.png' })
			.add({ name: 'batteryLife_25', url: 'images/GUI/battery_25.png' })
			.add({ name: 'batteryLife_0', url: 'images/GUI/battery_0.png' })
			.add({ name: 'battery', url: 'images/battery.png' })
			.add({ name: 'wallLeft', url: 'images/wall_left.png' })
			.add({ name: 'wallRight', url: 'images/wall_right.png' })
			.add({ name: 'asteroidFlare', url: 'images/asteroid_flare.png' })
			.load(function () {
				//Load walls
				graphics.wallLeft = new PIXI.Sprite(PIXI.loader.resources.wallLeft.texture);
				graphics.wallRight = new PIXI.Sprite(PIXI.loader.resources.wallRight.texture);

				//Load asteroids
				graphics.asteroidsTexture[0] = new PIXI.Texture(PIXI.loader.resources.asteroid1.texture);
				graphics.asteroidsTexture[1] = new PIXI.Texture(PIXI.loader.resources.asteroid2.texture);
				graphics.asteroidsTexture[2] = new PIXI.Texture(PIXI.loader.resources.asteroid3.texture);
				graphics.asteroidsTexture[3] = new PIXI.Texture(PIXI.loader.resources.asteroid4.texture);
				graphics.asteroidFlareTexture = new PIXI.Texture(PIXI.loader.resources.asteroidFlare.texture);

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
				//Flare
				graphics.rightFlareTexture = new PIXI.Texture(PIXI.loader.resources.rightFlare.texture);
				graphics.leftFlareTexture = new PIXI.Texture(PIXI.loader.resources.leftFlare.texture);
				//D-pad and flare button for mobile on-screen controls
				graphics.leftArrow = new PIXI.Sprite(PIXI.loader.resources.leftArrow.texture);
				graphics.rightArrow = new PIXI.Sprite(PIXI.loader.resources.rightArrow.texture);
				graphics.upArrow = new PIXI.Sprite(PIXI.loader.resources.upArrow.texture);
				graphics.downArrow = new PIXI.Sprite(PIXI.loader.resources.downArrow.texture);
				graphics.flareButton = new PIXI.Sprite(PIXI.loader.resources.flareButton.texture);
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
				graphics.gameScore = new PIXI.Text('Score:0', {
					fontWeight: 'normal',
					fontStyle: 'normal',
					fontSize: 24,
					fontFamily: 'Courier New',
					fill: '#FFF',
					align: 'left',
					stroke: '#AAA',
					strokeThickness: 1
				});

				//Score
				graphics.batteryLabel = new PIXI.Text('Battery', {
					fontWeight: 'normal',
					fontStyle: 'normal',
					fontSize: 24,
					fontFamily: 'Courier New',
					fill: '#FFF',
					align: 'left',
					stroke: '#AAA',
					strokeThickness: 1
				});

				//Play Button
				graphics.playButton = new PIXI.Sprite(PIXI.loader.resources.menuButton.texture);
				graphics.playLabel = new PIXI.Text('Play PC Mode', {
					fontWeight: 'normal',
					fontStyle: 'normal',
					fontSize: 32,
					fontFamily: 'Courier New',
					fill: '#FFF',
					align: 'left',
					stroke: '#AAA',
					strokeThickness: 1
				});

				//Play Mobile Button
				graphics.playMobileButton = new PIXI.Sprite(PIXI.loader.resources.menuButton.texture);
				graphics.playMobileLabel = new PIXI.Text('Play Mobile', {
					fontWeight: 'normal',
					fontStyle: 'normal',
					fontSize: 32,
					fontFamily: 'Courier New',
					fill: '#FFF',
					align: 'left',
					stroke: '#AAA',
					strokeThickness: 1
				});

				//Game over screen and Main menu Button
				graphics.gameOverLabel = new PIXI.Text('Game Over!', {
					fontWeight: 'normal',
					fontStyle: 'normal',
					fontSize: 32,
					fontFamily: 'Courier New',
					fill: '#FFF',
					align: 'left',
					stroke: '#AAA',
					strokeThickness: 1
				});
				graphics.mainMenuButton = new PIXI.Sprite(PIXI.loader.resources.menuButton.texture);
				graphics.mainMenuLabel = new PIXI.Text('Main Menu', {
					fontWeight: 'normal',
					fontStyle: 'normal',
					fontSize: 32,
					fontFamily: 'Courier New',
					fill: '#FFF',
					align: 'left',
					stroke: '#AAA',
					strokeThickness: 1
				});


				//Initialize graphics
				graphics.init();

				const animationTicker = new PIXI.ticker.Ticker();
				animationTicker.stop();
				animationTicker.add((deltaTime) => {
					graphics.animateStars(deltaTime);
				});
				animationTicker.start();
			});
	},

	init: function () {
		// GUI elements
		this.playButton.x = 355;
		this.playButton.y = 200;
		this.playLabel.x = 483;
		this.playLabel.y = 215;
		this.playLabel.anchor.x = 0.5;
		this.playMobileButton.x = 352;
		this.playMobileButton.y = 300;
		this.playMobileLabel.x = 483;
		this.playMobileLabel.y = 315;
		this.playMobileLabel.anchor.x = 0.5;
		this.mainMenuButton.x = 352;
		this.mainMenuButton.y = 300;
		this.gameOverLabel.x = 483;
		this.gameOverLabel.y = 215;
		this.gameOverLabel.anchor.x = 0.5;
		this.mainMenuLabel.x = 483;
		this.mainMenuLabel.y = 315;
		this.mainMenuLabel.anchor.x = 0.5;


		this.gameScore.x = 740;
		this.gameScore.y = 560;
		this.gameScore.anchor.x = 0;
		this.batteryLabel.x = 740;
		this.batteryLabel.y = 594;
		this.batteryLabel.anchor.x = 0;
		this.batteryLife.x = 850;
		this.batteryLife.y = 600;
		this.volumeLine.x = 50;
		this.volumeLine.y = 16;
		this.volumeSlider.x = 90;//134;
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
		this.playButton.interactive = true;
		this.playButton.buttonMode = true;
		this.playMobileButton.interactive = true;
		this.playMobileButton.buttonMode = true;
		this.mainMenuButton.interactive = true;
		this.mainMenuButton.buttonMode = true;
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

		//Play the game
		this.playButton.on('pointerdown', () => { game.runOverworld(false) });
		this.playMobileButton.on('pointerdown', () => { game.runOverworld(true) });

		//Game over, go back to main menu
		this.mainMenuButton.on('pointerdown', () => {
			location.reload();
			//graphics.removeGameOver();
			//game.stopSound('game');
			//game.runMenu(true);
		});

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
		game.init();
		game.runMenu(); //TODO add main menu
	}
};

var layout = {
	ratio: graphics.screenWidth / graphics.screenHeight,

	resizeCanvas: function () {
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

	addListeners: function () {
		//Scale game to fit perfectly as the user resizes their browser window
		$(window).resize(function () {
			layout.resizeCanvas();
		});

		//Resize when a mobile devices switches between portrait and landscape orientation
		$(window).on("orientationchange", function () {
			layout.resizeCanvas();
		});
	}
};

graphics.start();
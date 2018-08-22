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
	shootButton: null,

	//GUI elements
	volumeSlider: null,
	volumeLine: null,
	mainMenuButton: null,
	playButton: null,
	playMobileButton: null,

	addSpace: function () {
		//graphics.app.stage.addChild(graphics.space);
		for (var i = 0; i < 100; i++) {
			var x = (Math.random() * 192 % 192 ) * 5;
			var y = (Math.random() * 128 % 128 ) * 5;
			var ySpeed = Math.random() * 1000 % 3;
			ySpeed *= 0.04 + 0.9;

			var img = Math.ceil(Math.random() * 20) - 1;
			if (img > 9) img = Math.ceil(Math.random() * 3) - 1;
			var star = {
				sprite: new PIXI.Sprite(graphics.starTexture[img]),
				ySpeed: ySpeed * 0.04 + 0.8
			};
			star.sprite.x = x;
			star.sprite.y = y;
			graphics.stars.push(star);
		}

		//draw stars
		graphics.addStars();
	},
	addStars: function() {
		graphics.stars.forEach(star => {
			graphics.app.stage.addChild(star.sprite);
		});
	},
	addWalls: function () {
		graphics.wallLeft.x = -500;
		graphics.wallLeft.y = 0;
		graphics.app.stage.addChild(graphics.wallLeft);

		graphics.wallRight.x = 950;
		graphics.wallRight.y = 0;
		graphics.app.stage.addChild(graphics.wallRight);

		game.state.wallLeft = { sprite: graphics.wallLeft, xSpeed: 0.11 };
		game.state.wallRight = { sprite: graphics.wallRight, xSpeed: -0.11 };
	},
	addPlayer: function (x, y) {

		//create player base, then add a sprite to it.
		var player = game.state.player;

		// create new sprite TOO make it from the image textures loaded in
		player.sprite = new PIXI.Sprite(graphics.shipTexture);

		//add sprite to player
		player.sprite.x = x;
		player.sprite.y = y;
		game.state.player = player;

		//add sprite to the screen.
		graphics.app.stage.addChild(game.state.player.sprite);
	},
	removeOverworldGUI: function () {
		if (graphics.mobileMode) {
			graphics.app.stage.removeChild(graphics.leftArrow);
			graphics.app.stage.removeChild(graphics.rightArrow);
			graphics.app.stage.removeChild(graphics.upArrow);
			graphics.app.stage.removeChild(graphics.downArrow);
			graphics.app.stage.removeChild(graphics.shootButton);
		}
		graphics.app.stage.removeChild(graphics.batteryLife);
		graphics.app.stage.removeChild(graphics.gameScore);
		graphics.app.stage.removeChild(graphics.batteryLabel);
	},

	addOverworldGUI: function () {
		if (graphics.mobileMode) {
			graphics.app.stage.addChild(graphics.leftArrow);
			graphics.app.stage.addChild(graphics.rightArrow);
			graphics.app.stage.addChild(graphics.upArrow);
			graphics.app.stage.addChild(graphics.downArrow);
			graphics.app.stage.addChild(graphics.shootButton);
		}
		graphics.app.stage.addChild(graphics.volumeLine);
		graphics.app.stage.addChild(graphics.volumeSlider);
		graphics.app.stage.addChild(graphics.batteryLife);
		graphics.app.stage.addChild(graphics.gameScore);
		graphics.app.stage.addChild(graphics.batteryLabel);
	},

	addMenuGUI: function () {
		graphics.app.stage.addChild(graphics.playButton);
		graphics.app.stage.addChild(graphics.playLabel);
		graphics.app.stage.addChild(graphics.playMobileButton);
		graphics.app.stage.addChild(graphics.playMobileLabel);
		graphics.app.stage.addChild(graphics.volumeLine);
		graphics.app.stage.addChild(graphics.volumeSlider);
	},

	removeMenuGUI: function () {
		graphics.app.stage.removeChild(graphics.playButton);
		graphics.app.stage.removeChild(graphics.playLabel);
		graphics.app.stage.removeChild(graphics.playMobileButton);
		graphics.app.stage.removeChild(graphics.playMobileLabel);
	},

	runOverworld: function (mobileMode) {
		graphics.removeMenuGUI();
		graphics.mobileMode = mobileMode;
		graphics.addWalls();
		graphics.addPlayer(512, 512);
		graphics.addOverworldGUI();
	},

	runMenu: function () {
		graphics.addMenuGUI();
	},

	gameOver: function () {
		graphics.app.stage.addChild(graphics.gameOverLabel);
		graphics.app.stage.addChild(graphics.mainMenuButton);
		graphics.app.stage.addChild(graphics.mainMenuLabel);
	},

	removeGameOver: function () {
		graphics.app.stage.removeChild(graphics.gameOverLabel);
		graphics.app.stage.removeChild(graphics.mainMenuButton);
		graphics.app.stage.removeChild(graphics.mainMenuLabel);
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
		leftFlareSprite.x = asteroidFlare.sprite.x - asteroidFlare.sprite.width - graphics.leftFlareTexture.width / 2;
		leftFlareSprite.y = asteroidFlare.sprite.y - graphics.leftFlareTexture.height;
		graphics.app.stage.addChild(leftFlareSprite);
		var leftFlare = { sprite: leftFlareSprite, xSpeed: -15 };
		game.state.leftFlares.push(leftFlare);

		//------------

		var rightFlareSprite = new PIXI.Sprite(graphics.rightFlareTexture);
		rightFlareSprite.x = asteroidFlare.sprite.x + asteroidFlare.sprite.width - graphics.rightFlareTexture.width / 2;
		rightFlareSprite.y = asteroidFlare.sprite.y - graphics.rightFlareTexture.height;
		graphics.app.stage.addChild(rightFlareSprite);
		var rightFlare = { sprite: rightFlareSprite, xSpeed: 15 };
		game.state.rightFlares.push(rightFlare);
	},
	addBeam: function () {
		var beamSprite = new PIXI.Sprite(graphics.beamTexture);
		beamSprite.x = game.state.player.sprite.x + game.state.player.sprite.width / 2 - graphics.beamTexture.width / 2;
		beamSprite.y = game.state.player.sprite.y - graphics.beamTexture.height;
		graphics.app.stage.addChild(beamSprite);

		var beam = { sprite: beamSprite, ySpeed: -30 };
		game.state.beams.push(beam);
	},

	addAsteroid: function (top) {
		var asteroidSprite = new PIXI.Sprite(graphics.asteroidsTexture[0]);
		//spawn between the walls
		asteroidSprite.x = Math.random()
			* (game.state.wallRight.sprite.x - ((game.state.wallLeft.sprite.x + game.state.wallLeft.sprite.width)) - asteroidSprite.width * 2)
			+ game.state.wallLeft.sprite.x + game.state.wallLeft.sprite.width + asteroidSprite.width;


		if (top) asteroidSprite.y = - graphics.asteroidsTexture[0].height;
		else asteroidSprite.y = 640;

		graphics.app.stage.addChild(asteroidSprite);

		var asteroid = {
			sprite: asteroidSprite,
			ySpeed: top ? Math.random() + 1 : (Math.random() - 1) * 0.9,
			xSpeed: Math.random() * 2 - 1
		};
		game.state.asteroids.push(asteroid);
	},

	addAsteroidFlare: function () {
		var asteroidFlareSprite = new PIXI.Sprite(graphics.asteroidFlareTexture);
		//spawn between the walls
		asteroidFlareSprite.x = 960 / 2 - asteroidFlareSprite.width / 2;
		asteroidFlareSprite.y = 0 - asteroidFlareSprite.height;

		graphics.app.stage.addChild(asteroidFlareSprite);

		var asteroidFlare = {
			sprite: asteroidFlareSprite,
			ySpeed: 1,
			xSpeed: 0
		};
		game.state.asteroidFlares.push(asteroidFlare);
	},

	addPowerup: function () {
		var powerupSprite = new PIXI.Sprite(graphics.powerupTexture);
		powerupSprite.x = game.state.player.sprite.x + game.state.player.sprite.width / 2 - graphics.powerupTexture.width / 2;
		powerupSprite.y = 0;
		graphics.app.stage.addChild(powerupSprite);

		var powerup = { sprite: powerupSprite, ySpeed: 3.14, xSpeed: (Math.random() - 0.5) * 1.5 };
		game.state.powerups.push(powerup);
	},

	drawScore: function () {
		graphics.gameScore.text = 'Score:' + Math.floor(game.state.score);
	},

	start: function () {
		var type = "WebGL";
		if (!PIXI.utils.isWebGLSupported()) {
			type = "canvas";
		}
		PIXI.utils.sayHello(type);

		graphics.app = new PIXI.Application(graphics.screenWidth, graphics.screenHeight, { backgroundColor: graphics.backgroundColor });

		console.log(document);
		console.log(document.body);

		document.getElementById('content').appendChild(graphics.app.view);

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
			.add({ name: 'shootButton', url: 'images/GUI/shoot_button.png' })
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
				graphics.shootButton = new PIXI.Sprite(PIXI.loader.resources.shootButton.texture);
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

				//always animate stars
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
		graphics.playButton.x = 355;
		graphics.playButton.y = 200;
		graphics.playLabel.x = 483;
		graphics.playLabel.y = 215;
		graphics.playLabel.anchor.x = 0.5;
		graphics.playMobileButton.x = 352;
		graphics.playMobileButton.y = 300;
		graphics.playMobileLabel.x = 483;
		graphics.playMobileLabel.y = 315;
		graphics.playMobileLabel.anchor.x = 0.5;
		graphics.mainMenuButton.x = 352;
		graphics.mainMenuButton.y = 300;
		graphics.gameOverLabel.x = 483;
		graphics.gameOverLabel.y = 215;
		graphics.gameOverLabel.anchor.x = 0.5;
		graphics.mainMenuLabel.x = 483;
		graphics.mainMenuLabel.y = 315;
		graphics.mainMenuLabel.anchor.x = 0.5;


		graphics.gameScore.x = 740;
		graphics.gameScore.y = 560;
		graphics.gameScore.anchor.x = 0;
		graphics.batteryLabel.x = 740;
		graphics.batteryLabel.y = 594;
		graphics.batteryLabel.anchor.x = 0;
		graphics.batteryLife.x = 850;
		graphics.batteryLife.y = 600;
		graphics.volumeLine.x = 50;
		graphics.volumeLine.y = 16;
		graphics.volumeSlider.x = 90;//134;
		graphics.volumeSlider.y = 8;
		graphics.leftArrow.x = 50;
		graphics.leftArrow.y = 410;
		graphics.rightArrow.x = 250;
		graphics.rightArrow.y = 410;
		graphics.upArrow.x = 150;
		graphics.upArrow.y = 310;
		graphics.downArrow.x = 150;
		graphics.downArrow.y = 510;
		graphics.shootButton.x = 800;
		graphics.shootButton.y = 410;
		graphics.leftArrow.interactive = true;
		graphics.leftArrow.buttonMode = true;
		graphics.rightArrow.interactive = true;
		graphics.rightArrow.buttonMode = true;
		graphics.upArrow.interactive = true;
		graphics.upArrow.buttonMode = true;
		graphics.downArrow.interactive = true;
		graphics.downArrow.buttonMode = true;
		graphics.shootButton.interactive = true;
		graphics.shootButton.buttonMode = true;
		graphics.playButton.interactive = true;
		graphics.playButton.buttonMode = true;
		graphics.playMobileButton.interactive = true;
		graphics.playMobileButton.buttonMode = true;
		graphics.mainMenuButton.interactive = true;
		graphics.mainMenuButton.buttonMode = true;
		//press touch screen constrols
		graphics.leftArrow.on('pointerdown', game.movePlayerLeft);
		graphics.rightArrow.on('pointerdown', game.movePlayerRight);
		graphics.upArrow.on('pointerdown', game.movePlayerUp);
		graphics.downArrow.on('pointerdown', game.movePlayerDown);
		//release touch screen controls
		graphics.leftArrow.on('pointerup', game.stopPlayerLeft);
		graphics.rightArrow.on('pointerup', game.stopPlayerRight);
		graphics.upArrow.on('pointerup', game.stopPlayerUp);
		graphics.downArrow.on('pointerup', game.stopPlayerDown);

		//shoot a flare to battle the walls
		graphics.shootButton.on('pointerdown', game.shootBeam);

		//Play the game
		graphics.playButton.on('pointerdown', () => { game.runOverworld(false) });
		graphics.playMobileButton.on('pointerdown', () => { game.runOverworld(true) });

		//Game over, go back to main menu
		graphics.mainMenuButton.on('pointerdown', () => {
			graphics.removeGameOver();
			graphics.removeOverworldGUI();
			game.runMenu();
		});

		//Auto resize window
		layout.addListeners();
		layout.resizeCanvas();

		//Interactivity for volume slide 
		graphics.volumeSlider.interactive = true;
		graphics.volumeSlider.buttonMode = true;
		graphics.volumeSlider.on('pointerdown', game.onDragStart);
		graphics.volumeSlider.on('pointerup', game.onDragEnd);
		graphics.volumeSlider.on('pointerupoutside', game.onDragEnd);
		graphics.volumeSlider.on('pointerup', game.updateSound);
		graphics.volumeSlider.on('pointermove', game.onDragMove);

		//Build stars once
		graphics.addSpace();

		//Start the game!
		game.init();
		game.runMenu();
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
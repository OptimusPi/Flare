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
	shootButton: null,
	thumbstick_area: null,
	thumbstick: null,
	thumbstickOrigin: { x: 130, y: 450 },

	//GUI elements
	initButton: null,
	volumeSlider: null,
	volumeLine: null,
	mainMenuButton: null,
	playButton: null,
	playMobileButton: null,
	starCount: 500,

	addSpace: function () {

		//create sprite containers
		let starContainers = [];
		for (let i = 0; i < 10; i++) {
			starContainers.push(new PIXI.particles.ParticleContainer());
		}

		//graphics.app.stage.addChild(graphics.space);
		for (var i = 0; i < graphics.starCount; i++) {
			var x = (Math.random() * 980 % 980 ) - 10;
			var y = (Math.random() * 660 % 660 ) - 10;
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

			//add to correct container
			starContainers[img].addChild(star.sprite);
		}

		//draw stars
		for (let i = 0; i < 10; i++) {
			graphics.app.stage.addChild(starContainers[i]);
		}
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
		player.sprite.frame = 0;

		//add sprite to player
		player.sprite.x = x;
		player.sprite.y = y;
		game.state.player = player;

		//add sprite to the screen.
		graphics.app.stage.addChild(game.state.player.sprite);
	},
	removeOverworldGUI: function () {
		if (graphics.mobileMode) {
			graphics.app.stage.removeChild(graphics.shootButton);
			graphics.app.stage.removeChild(graphics.thumbstick_area);
			graphics.app.stage.removeChild(graphics.thumbstick);
		}
		graphics.app.stage.removeChild(graphics.batteryLife);
		graphics.app.stage.removeChild(graphics.gameScore);
		graphics.app.stage.removeChild(graphics.batteryLabel);
	},

	addOverworldGUI: function () {
		if (graphics.mobileMode) {
			graphics.app.stage.addChild(graphics.shootButton);
			graphics.app.stage.addChild(graphics.thumbstick_area);
			graphics.app.stage.addChild(graphics.thumbstick);
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
		for (let i = 0; i < graphics.stars.length; i++) {
			let star = graphics.stars[i];
			star.sprite.y += star.ySpeed * deltaTime;
			if (star.sprite.y > 640) {
				star.sprite.y = -star.sprite.height;
				star.sprite.x = Math.random() * 960 % 960;
			}
		}	
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

		graphics.app = new PIXI.Application(graphics.screenWidth, graphics.screenHeight, { backgroundColor: graphics.backgroundColor});

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
			.add({ name: 'shootButton', url: 'images/GUI/shoot_button.png' })
			.add({ name: 'thumbstick_area', url: 'images/GUI/thumbstick_area.png' })
			.add({ name: 'thumbstick', url: 'images/GUI/thumbstick.png' })
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
				graphics.starTexture[8] = new PIXI.Texture(PIXI.loader.resources.star9.texture);
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
				//mobile on-screen controls
				graphics.shootButton = new PIXI.Sprite(PIXI.loader.resources.shootButton.texture);
				graphics.thumbstick_area = new PIXI.Sprite(PIXI.loader.resources.thumbstick_area.texture);
				graphics.thumbstick = new PIXI.Sprite(PIXI.loader.resources.thumbstick.texture);
				//volume control
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

				//Init Button
				graphics.initButton = new PIXI.Sprite(PIXI.loader.resources.menuButton.texture);
				graphics.initLabel = new PIXI.Text('Play Flare', {
					fontWeight: 'normal',
					fontStyle: 'normal',
					fontSize: 32,
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
				animationTicker.add(function(deltaTime) {
					graphics.animateStars(deltaTime);
				});
				animationTicker.speed = 0.5;
				animationTicker.start();
			});
	},

	init: function () {
		// GUI elements
		graphics.initButton.x = 355;
		graphics.initButton.y = 200;
		graphics.initLabel.x = 483;
		graphics.initLabel.y = 215;
		graphics.initLabel.anchor.x = 0.5;
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
		graphics.volumeSlider.zOrder = 101;
		graphics.volumeSlider.x = 90;//134;
		graphics.volumeSlider.y = 8;
		graphics.shootButton.x = 800;
		graphics.shootButton.y = 410;
		graphics.thumbstick_area.x = 80;
		graphics.thumbstick_area.y = 400;
		graphics.thumbstick.x = graphics.thumbstickOrigin.x;
		graphics.thumbstick.y = graphics.thumbstickOrigin.y;
		graphics.thumbstick.anchor.x = 0.5;
		graphics.thumbstick.anchor.y = 0.5;
		graphics.shootButton.interactive = true;
		graphics.shootButton.interactiveChildren = false;
		graphics.shootButton.buttonMode = true;
		graphics.thumbstick.interactive = true;
		graphics.thumbstick.interactiveChildren = false;
		graphics.thumbstick.buttonMode = true;
		graphics.initButton.interactive = true;
		graphics.initButton.interactiveChildren = false;
		graphics.initButton.buttonMode = true;
		graphics.playButton.interactive = true;
		graphics.playButton.interactiveChildren = false;
		graphics.playButton.buttonMode = true;
		graphics.playMobileButton.interactive = true;
		graphics.playMobileButton.interactiveChildren = false;
		graphics.playMobileButton.buttonMode = true;
		graphics.mainMenuButton.interactive = true;
		graphics.mainMenuButton.interactiveChildren = false;
		graphics.mainMenuButton.buttonMode = true;
		//touch screen controls
		graphics.thumbstick.on('pointerdown', game.thumbstickTouch);
		graphics.thumbstick.on('pointermove', game.thumbstickMove);
		graphics.thumbstick.on('pointerup', game.thumbstickReset);
		graphics.thumbstick.on('pointerupoutside', game.thumbstickReset);

		//shoot a flare to battle the walls
		graphics.shootButton.on('pointerdown', game.shootBeam);

		//Play the game
		graphics.playButton.on('pointerdown', function() { game.runOverworld(false) });
		graphics.playMobileButton.on('pointerdown', function() { game.runOverworld(true) });

		//Game over, go back to main menu
		graphics.mainMenuButton.on('pointerdown', function() {
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

		//splash screen to get around auto play policies
		graphics.app.stage.addChild(graphics.initButton);
		graphics.app.stage.addChild(graphics.initLabel);
		graphics.initButton.on('pointerdown', function() {
			graphics.app.stage.removeChild(graphics.initLabel);
			graphics.app.stage.removeChild(graphics.initButton);
			
			//Start the game!
			game.init();
			game.runMenu();
		});
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
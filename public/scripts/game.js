debug.log('game.js');

const initialGameState = {
  //player
  player: { sprite: null, dead: false, frame: 0, battery: 100, xSpeed: 0, ySpeed: 0, left: 0, right: 0, up: 0, down: 0, horizontal: 0, vertical: 0 },
  shipParts: [],
  beams: [],
  leftFlares: [],
  rightFlares: [],
  powerups: [],
  asteroids: [],
  asteroidFlares: [],
  asteroidPieces: [],
  powerupTimer: 0,
  asteroidTimer: 0,
  asteroidFlareTimer: 0,
  wallLeft: {},
  wallRight: {},
  score: 0
};

var game = {

  state: null,
  ticker: null,
  scoreTicker: null,

  //keyboard arrow keys
  left: keyboard(37),
  up: keyboard(38),
  right: keyboard(39),
  down: keyboard(40),
  space: keyboard(32),
  shift: keyboard(16),
  //Functions
  onDragStart: function (event) {
    this.data = event.data;
    this.alpha = 0.6;
    this.dragging = true;
  },

  onDragEnd: function () {
    this.alpha = 1;
    this.dragging = false;
    this.data = null;
  },

  onDragMove: function () {
    if (this.dragging) {
      var x = this.data.getLocalPosition(this.parent).x;

      if (x > 150) {
        x = 150;
      }
      if (x < 50) {
        x = 50;
      }

      graphics.volumeSlider.x = x - 16;
      game.updateSound();
    }
  },

  thumbstickTouch: function (event) {
    this.data = event.data;
    this.alpha = 0.6;
    this.dragging = true;
  },

  thumbstickReset: function () {
    this.alpha = 1;
    this.dragging = false;
    this.data = null;

    graphics.thumbstick.x =  graphics.thumbstickOrigin.x;
    graphics.thumbstick.y =  graphics.thumbstickOrigin.y;
    game.state.player.horizontal = 0;
    game.state.player.vertical = 0;
  },

  thumbstickMove: function () {
    var thumbstickAreaDiameter = 50;

    if (this.dragging) {
      var x = this.data.getLocalPosition(this.parent).x;
      var y = this.data.getLocalPosition(this.parent).y;

      //todo - if distance > 50, calculate distance of 50
      var bigX = x - graphics.thumbstickOrigin.x;
      var bigY = y - graphics.thumbstickOrigin.y;
      var newX = x;
      var newY = y;
      var distance = Math.sqrt(Math.abs(bigX)*Math.abs(bigX) + Math.abs(bigY)*Math.abs(bigY));


      if (distance > thumbstickAreaDiameter) {
        var ratio = thumbstickAreaDiameter / distance;
        newX = graphics.thumbstickOrigin.x + bigX * ratio;
        newY = graphics.thumbstickOrigin.y + bigY * ratio;
      }

      graphics.thumbstick.x = newX;
      graphics.thumbstick.y = newY;

      //move move the ship controls
      game.state.player.horizontal = (newX - graphics.thumbstickOrigin.x) / thumbstickAreaDiameter;
      game.state.player.vertical = (newY - graphics.thumbstickOrigin.y) / thumbstickAreaDiameter;
    }
  },

  playSound: function (sound) {
    PIXI.sound.play(sound);
  },
  stopSound: function (sound) {
    PIXI.sound.stop(sound);
  },
  updateSound: function () {
    var volume = 1 - ((134 - graphics.volumeSlider.x) / 100);
    volume = volume * volume;
    PIXI.sound.volumeAll = volume;
    console.log('volume: ' + volume);
  },
  runMenu: function () {
    game.removeOverworld();
    game.setState(initialGameState);
    game.playSound('menu');
    game.updateSound();
    graphics.runMenu();
  },
  runOverworld: function (mobileMode) {
    game.setState(initialGameState);
    game.state.player.battery = 100;
    game.addBattery(100);
    game.state.player.dead = false;
    game.stopSound('menu');
    graphics.runOverworld(mobileMode);
    game.playSound('game');
    game.updateSound();
    game.ticker.start();
    game.scoreTicker.start();
  },
  setState: function(state) {
    game.state = JSON.parse(JSON.stringify(state));
  },
  removeOverworld: function () {
    game.stopSound('game');

    //stop game physics loop
    game.ticker.stop();

    //stop score ticker
    game.scoreTicker.stop();

    /** remove all game object collections **/
    for (let i = 0; i < game.state.asteroids.length; i++) graphics.app.stage.removeChild(game.state.asteroids[i].sprite);
    for (let i = 0; i < game.state.asteroidFlares.length; i++) graphics.app.stage.removeChild(game.state.asteroidFlares[i].sprite);
    for (let i = 0; i < game.state.beams.length; i++) graphics.app.stage.removeChild(game.state.beams[i].sprite);
    for (let i = 0; i < game.state.powerups.length; i++) graphics.app.stage.removeChild(game.state.powerups[i].sprite);
    for (let i = 0; i < game.state.shipParts.length; i++) graphics.app.stage.removeChild(game.state.shipParts[i].sprite);
    for (let i = 0; i < game.state.leftFlares.length; i++) graphics.app.stage.removeChild(game.state.leftFlares[i].sprite);
    for (let i = 0; i < game.state.rightFlares.length; i++) graphics.app.stage.removeChild(game.state.rightFlares[i].sprite);
    for (let i = 0; i < game.state.asteroidPieces.length; i++) graphics.app.stage.removeChild(game.state.asteroidPieces[i].sprite);

    
    /** remove all game objects **/
    graphics.app.stage.removeChild(game.state.wallLeft.sprite);
    graphics.app.stage.removeChild(game.state.wallRight.sprite);
  },

  //start moving, flag that controls acceleration
  movePlayerLeft: function () {
    game.state.player.left = -1;
  },
  movePlayerRight: function () {
    game.state.player.right = 1;
  },
  movePlayerUp: function () {
    game.state.player.up = -1;
  },
  movePlayerDown: function () {
    game.state.player.down = 1;
  },
  shootBeam: function () {
    if (game.state.player.dead === true) return;
    if (game.state.player.battery === 0) return;

    game.addBattery(-25);
    game.playSound('beam');
    //game.stopSound('beam');
    graphics.addBeam();
  },
  addBattery: function (percent) {
    game.state.player.battery += percent;

    if (game.state.player.battery > 100)
      game.state.player.battery = 100;
    if (game.state.player.battery < 0)
      game.state.player.battery = 0;

    if (game.state.player.battery === 100) graphics.batteryLife.texture = graphics.batteryLifeTexture_100;
    if (game.state.player.battery === 75) graphics.batteryLife.texture = graphics.batteryLifeTexture_75;
    if (game.state.player.battery === 50) graphics.batteryLife.texture = graphics.batteryLifeTexture_50;
    if (game.state.player.battery === 25) graphics.batteryLife.texture = graphics.batteryLifeTexture_25;
    if (game.state.player.battery === 0) graphics.batteryLife.texture = graphics.batteryLifeTexture_0;
  },
  //stop moving, flag that controls acceleration
  stopPlayerLeft: function () {
    game.state.player.left = 0;
  },
  stopPlayerRight: function () {
    game.state.player.right = 0;
  },
  stopPlayerUp: function () {
    game.state.player.up = 0;
  },
  stopPlayerDown: function () {
    game.state.player.down = 0;
  },

  shootFlare: function (asteroidFlare) { //TODO Raghav
    if (game.state.player.battery == 100) {
      graphics.addFlare(asteroidFlare);
      game.addBattery(-100);
    }
  },
  resetRightWall: function () {
    game.state.wallRight.xSpeed = 5;
  },
  resetLeftWall: function () {
    game.state.wallLeft.xSpeed = -5;
  },
  boxesIntersect: function (a, b) {
    var ab = a.getBounds();
    var bb = b.getBounds();
    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
  },

  addScore: function (deltaTime) {
    if (game.state.player.dead)
        return;

    game.state.score += 0.875 * deltaTime;
  },

  killPlayer: function () {
    if (game.state.player.dead)
      return;

    game.state.player.dead = true;
    game.playSound('ship_breaking');

    //Make dead ship pieces
    game.state.shipParts[0] = {
      sprite: new PIXI.Sprite(graphics.shipPart1Texture), xSpeed: -4, ySpeed: -4, dead: false
    };
    game.state.shipParts[1] = {
      sprite: new PIXI.Sprite(graphics.shipPart2Texture), xSpeed: 4, ySpeed: -4, dead: false
    };
    game.state.shipParts[2] = {
      sprite: new PIXI.Sprite(graphics.shipPart3Texture), xSpeed: -4, ySpeed: 4, dead: false
    };
    game.state.shipParts[3] = {
      sprite: new PIXI.Sprite(graphics.shipPart4Texture), xSpeed: 4, ySpeed: 4, dead: false
    };
    //
    //Position dead ship parts in each corner
    //
    //top left
    game.state.shipParts[0].sprite.x = game.state.player.sprite.x;
    game.state.shipParts[0].sprite.y = game.state.player.sprite.y;

    //top right
    game.state.shipParts[1].sprite.x = game.state.player.sprite.x + 32;
    game.state.shipParts[1].sprite.y = game.state.player.sprite.y;

    //bottom left
    game.state.shipParts[2].sprite.x = game.state.player.sprite.x;
    game.state.shipParts[2].sprite.y = game.state.player.sprite.y + 32;

    //bottom right
    game.state.shipParts[3].sprite.x = game.state.player.sprite.x + 32;
    game.state.shipParts[3].sprite.y = game.state.player.sprite.y + 32;

    //add ship pieces to the screen
    graphics.app.stage.addChild(game.state.shipParts[0].sprite);
    graphics.app.stage.addChild(game.state.shipParts[1].sprite);
    graphics.app.stage.addChild(game.state.shipParts[2].sprite);
    graphics.app.stage.addChild(game.state.shipParts[3].sprite);

    //remove original ship
    graphics.app.stage.removeChild(game.state.player.sprite);

    //game over!
    graphics.gameOver();
  },

  killAsteroid: function (asteroid) {

    //Make dead asteroid pieces
    var chunks = [{
      sprite: new PIXI.Sprite(graphics.asteroidsTexture[1]), xSpeed: -3, ySpeed: -7
    }, {
      sprite: new PIXI.Sprite(graphics.asteroidsTexture[2]), xSpeed: 3, ySpeed: -7
    }, {
      sprite: new PIXI.Sprite(graphics.asteroidsTexture[3]), xSpeed: Math.random() - 0.5, ySpeed: -7
    }];

    //
    //Position dead asteroid chunks
    //
    //top left
    chunks[0].sprite.x = asteroid.sprite.x - 5;
    chunks[0].sprite.y = asteroid.sprite.y - 5;

    //top right
    chunks[1].sprite.x = asteroid.sprite.x + 5;
    chunks[1].sprite.y = asteroid.sprite.y - 5;

    //bottom left
    chunks[2].sprite.x = asteroid.sprite.x;
    chunks[2].sprite.y = asteroid.sprite.y;

    //add asteroid pieces to the screen
    graphics.app.stage.addChild(chunks[0].sprite);
    graphics.app.stage.addChild(chunks[1].sprite);
    graphics.app.stage.addChild(chunks[2].sprite);

    //add asteroid pieces to game collection
    game.state.asteroidPieces.push(chunks[0]);
    game.state.asteroidPieces.push(chunks[1]);
    game.state.asteroidPieces.push(chunks[2]);
  },

  // Kill red asteroid
  killAsteroidFlare: function (asteroidFlare) {
    graphics.addFlare(asteroidFlare);
  },

  init: function () {

    //initial state
    game.setState(initialGameState);

    //Left arrow key press method
    game.left.press = function () {
      game.movePlayerLeft();
    };
    game.left.release = function () {
      game.stopPlayerLeft();
    };

    //Right arrow key press method
    game.space.press = function () {
      game.shootBeam();
    };
    game.right.press = function () {
      game.movePlayerRight();
    };
    game.right.release = function () {
      game.stopPlayerRight();
    };

    //Up arrow key press method
    game.up.press = function () {
      game.movePlayerUp();
    };
    game.up.release = function () {
      game.stopPlayerUp();
    };
    //shift button press
    game.shift.press = function () {
      game.shootFlare();
    };

    //Down arrow key press method
    game.down.press = function () {
      game.movePlayerDown();
    };
    game.down.release = function () {
      game.stopPlayerDown();
    };

    //Game music
    PIXI.sound.add('game', {
      url: 'sounds/game.ogg',
      loop: true,
    });
    //Menu music
    PIXI.sound.add('menu', {
      url: 'sounds/menu.ogg',
      loop: true,
    });
    PIXI.sound.add('asteroid_breaking', {
      url: 'sounds/asteroid_breaking.ogg',
      loop: false,
    });
    PIXI.sound.add('beam', {
      url: 'sounds/beam.ogg',
      loop: false,
    });
    PIXI.sound.add('bounce', {
      url: 'sounds/bounce.ogg',
      loop: false,
    });
    PIXI.sound.add('powerup_pickup', {
      url: 'sounds/powerup_pickup.ogg',
      loop: false,
    });
    PIXI.sound.add('ship_breaking', {
      url: 'sounds/ship_breaking.ogg',
      loop: false,
    });

    //connect sprites to physics in game code
    game.ticker = new PIXI.ticker.Ticker();
    game.ticker.stop();
    game.ticker.add(function(deltaTime) {
      game.physics(deltaTime);
    });

    //score ticker, run slowly to optimize speed
    game.scoreTicker = new PIXI.ticker.Ticker();
    game.scoreTicker.stop();
    game.scoreTicker.add(function(deltaTime) {
      game.addScore(deltaTime);
      graphics.drawScore(game.state.score);
    });
    game.scoreTicker.speed = 0.02;
  },

  physics: function (deltaTime) {
    //if (graphics.wallRight.sprite.x > 949) game.wallRight.xSpeed = -0.2;
    //Ship physics
    if (game.state.player.dead === false) game.playerPhysics(deltaTime);
    if (game.state.player.dead === true) game.deadPlayerPhysics(deltaTime);

    //laser beam projectile physics
    game.beamPhysics(deltaTime);

    //flare physics
    game.flarePhysics(deltaTime);

    //asteroids and broken asteroid pieces physics
    game.asteroidPhysics(deltaTime);

    //powerups physics
    game.powerupPhysics(deltaTime);

    //Run out of space!
    game.wallPhysics(deltaTime);
  },

  wallPhysics: function(deltaTime) {
    if (!game.state.player.dead) {
      //move x based on xSpeed
      game.state.wallLeft.sprite.x += game.state.wallLeft.xSpeed * deltaTime;
      game.state.wallRight.sprite.x += game.state.wallRight.xSpeed * deltaTime;
      
      //maximum position boundary for edges of the play area
      if (game.state.wallLeft.sprite.x < -500) game.state.wallLeft.x = -500;
      if (game.state.wallRight.sprite.x > 950) game.state.wallRight.x = 950;

      //always approach natural speed limit
      if (game.state.wallLeft.xSpeed < 0.1) game.state.wallLeft.xSpeed += 0.1 * deltaTime;
      if (game.state.wallRight.xSpeed > -0.1) game.state.wallRight.xSpeed -= 0.1 * deltaTime;

      //maximum natural speed
      if (game.state.wallLeft.xSpeed > 0.1)  game.state.wallLeft.xSpeed = 0.1;
      if (game.state.wallRight.xSpeed < -0.1) game.state.wallRight.xSpeed = -0.1;

      //do not pinch the center of the play area too much
      if (game.state.wallLeft.sprite.x > -100) game.state.wallLeft.sprite.x = -100;
      if (game.state.wallRight.sprite.x < 550) game.state.wallRight.sprite.x = 550;
    }
  },
  
  deadPlayerPhysics: function (deltaTime) {
    for (var i = 0; i < 4; i++) {
      if (game.state.shipParts[i].dead === true) continue;
      game.state.shipParts[i].sprite.x += game.state.shipParts[i].xSpeed * deltaTime;
      game.state.shipParts[i].sprite.y += game.state.shipParts[i].ySpeed * deltaTime;

      //check for walls
      if (game.boxesIntersect(game.state.shipParts[i].sprite, game.state.wallLeft.sprite) ||
        game.boxesIntersect(game.state.shipParts[i].sprite, game.state.wallRight.sprite)) {
        graphics.app.stage.removeChild(game.state.shipParts[i].sprite);
        game.state.shipParts[i].dead = true;
      }
    }
  },

  powerupPhysics: function (deltaTime) {
    //spawn powerups 
    game.state.powerupTimer += deltaTime;
    if (game.state.powerupTimer > 300 && game.state.player.dead === false) {
      graphics.addPowerup();
      game.state.powerupTimer = 0;
    }

    //move powerups
    for (let i = 0; i < game.state.powerups.length; i++) {
      let powerup = game.state.powerups[i];
      powerup.sprite.y += powerup.ySpeed;
      powerup.sprite.x += powerup.xSpeed;


      if (game.boxesIntersect(powerup.sprite, game.state.player.sprite)) {
        graphics.app.stage.removeChild(powerup.sprite);
        game.state.powerups.splice(i, 1);
        game.addBattery(100);
        game.playSound('powerup_pickup');

        //add to score
        game.state.score += 1;
      }

      //bounce off the walls! 
      if (game.boxesIntersect(game.state.wallLeft.sprite, powerup.sprite)) {
        powerup.xSpeed *= -1;//bounce off the walls! 
        powerup.sprite.x += 2;
      }
      if (game.boxesIntersect(game.state.wallRight.sprite, powerup.sprite)) {
        powerup.xSpeed *= -1;//bounce off the walls! 
        powerup.sprite.x -= 2.0;
      }
    }
  },
  asteroidPhysics: function (deltaTime) {
    //spawn asteroids 
    game.state.asteroidTimer += deltaTime;
    if (game.state.asteroidTimer > 60 && game.state.player.dead == false) {
      graphics.addAsteroid(true);
      if (Math.random() > 0.9)
        graphics.addAsteroid(false);

      game.state.asteroidTimer = 0;
    }

    //spawn asteroid flares 
    
    if (game.state.score - game.state.asteroidFlareTimer > 50) {
       graphics.addAsteroidFlare();
       game.state.asteroidFlareTimer = game.state.score;
    }

    //move asteroids
    for (let index = 0; index < game.state.asteroids.length; index++) {
      let asteroid = game.state.asteroids[index];
      asteroid.sprite.y += asteroid.ySpeed;
      asteroid.sprite.x += asteroid.xSpeed;

      //this this asteroid hits players it kills them
      if (game.state.player.dead == false && game.boxesIntersect(asteroid.sprite, game.state.player.sprite)) {
        graphics.app.stage.removeChild(asteroid.sprite);
        game.state.asteroids.splice(index, 1);
        game.killPlayer();
      }

      //bounce off the walls! 
      if (game.boxesIntersect(game.state.wallLeft.sprite, asteroid.sprite)) {
        asteroid.xSpeed *= -1;//bounce off the walls! 
        asteroid.sprite.x += 2;
      }
      if (game.boxesIntersect(game.state.wallRight.sprite, asteroid.sprite)) {
        asteroid.xSpeed *= -1;//bounce off the walls! 
        asteroid.sprite.x -= 2.0;
      }

      //disappear off screen
      if (asteroid.y > 700 || asteroid.y < -100) {
        graphics.app.stage.removeChild(asteroid.sprite);
        game.state.asteroids.splice(index, 1);
      }
    }

    //move asteroid flares
    for (let index = 0; index < game.state.asteroidFlares.length; index++) {
      let asteroidFlare = game.state.asteroidFlares[index];
      asteroidFlare.sprite.y += asteroidFlare.ySpeed;
      asteroidFlare.sprite.x += asteroidFlare.xSpeed;

      //this this asteroidFlare hits players it kills them
      if (game.state.player.dead == false && game.boxesIntersect(asteroidFlare.sprite, game.state.player.sprite)) {
        graphics.app.stage.removeChild(asteroidFlare.sprite);
        game.state.asteroidFlares.splice(index, 1);
        game.killPlayer();
      }

      //disappear off screen
      if (asteroidFlare.y > 700) {
        graphics.app.stage.removeChild(asteroidFlare.sprite);
        game.state.asteroidFlares.splice(index, 1);
      }
    }

    //move dead asteroid pieces
    for (let index = 0; index < game.state.asteroidPieces.length; index++) {
      let asteroidPiece = game.state.asteroidPieces[index];
      asteroidPiece.sprite.y += asteroidPiece.ySpeed;
      asteroidPiece.sprite.x += asteroidPiece.xSpeed;

      //disappear off screen
      if (asteroidPiece.y < -32) {
        graphics.app.stage.removeChild(asteroidPiece.sprite);
        game.state.asteroidPieces.splice(index, 1);
      }
    }
  },

  playerPhysics: function (deltaTime) {
    //Accelerate ship
    horizontal = game.state.player.horizontal + game.state.player.left + game.state.player.right;
    vertical = game.state.player.vertical + game.state.player.up + game.state.player.down;
    var maxHorizontal = 4 * Math.abs(horizontal);
    var maxVertical = 4 * Math.abs(vertical);

    //X
    game.state.player.xSpeed += horizontal * 0.5 * deltaTime;
    if (horizontal === 0) game.state.player.xSpeed *= 0.8 / deltaTime;
    else if (game.state.player.xSpeed > maxHorizontal) game.state.player.xSpeed = maxHorizontal;
    else if (game.state.player.xSpeed < -maxHorizontal) game.state.player.xSpeed = -maxHorizontal;


    //Y
    game.state.player.ySpeed += vertical * 0.5 * deltaTime;
    if (vertical === 0) game.state.player.ySpeed *= 0.8 / deltaTime;
    else if (game.state.player.ySpeed > maxVertical) game.state.player.ySpeed = maxVertical;
    else if (game.state.player.ySpeed < -maxVertical) game.state.player.ySpeed = -maxVertical;


    //Move ship based on it's calculated 
    game.state.player.sprite.x += game.state.player.xSpeed * deltaTime;
    game.state.player.sprite.y += game.state.player.ySpeed * deltaTime;

    //Display ship boosters
    if (horizontal !== 0 || vertical !== 0) {
      //TODO put animations in graphics.js ?
      game.state.player.sprite.frame += deltaTime;
      if (game.state.player.sprite.frame % 6 < 6) game.state.player.sprite.texture = graphics.shipBoosting3Texture;
      if (game.state.player.sprite.frame % 6 < 4) game.state.player.sprite.texture = graphics.shipBoosting2Texture;
      if (game.state.player.sprite.frame % 6 < 2) game.state.player.sprite.texture = graphics.shipBoosting1Texture;
    } else {
      game.state.player.sprite.frame += deltaTime;
      if (game.state.player.sprite.frame % 6 < 6) game.state.player.sprite.texture = graphics.shipTexture;
      if (game.state.player.sprite.frame % 6 < 3) game.state.player.sprite.texture = graphics.shipBoosting1Texture;
    }
    //bounce off the walls! 
    if (game.boxesIntersect(game.state.wallLeft.sprite, game.state.player.sprite)) {
      game.state.player.xSpeed *= -1.5;//bounce off the walls! 
      game.state.player.sprite.x += 1.5;
      game.playSound('bounce');
    }
    if (game.boxesIntersect(game.state.wallRight.sprite, game.state.player.sprite)) {
      game.state.player.xSpeed *= -1.5;//bounce off the walls! 
      game.state.player.sprite.x -= 1.5;
      game.playSound('bounce');
    }
    if (game.state.player.sprite.y < 5) game.state.player.ySpeed = 2;
    if (game.state.player.sprite.y > 570) game.state.player.ySpeed = -2;
  },

  flarePhysics: function (deltaTime) {
    //move flares to the right
    for (let index = 0; index < game.state.leftFlares.length; index++) {
      let leftFlare = game.state.leftFlares[index];
      //move to the right
      leftFlare.sprite.x += leftFlare.xSpeed * deltaTime;

      //Check if it hits the wall, then get rid of it
      if (game.boxesIntersect(leftFlare.sprite, game.state.wallLeft.sprite)) {
        graphics.app.stage.removeChild(leftFlare.sprite);
        game.state.leftFlares.splice(index, 1);
        game.resetLeftWall();
        game.playSound('asteroid_breaking');
      }
    }

    for (let index = 0; index < game.state.rightFlares.length; index++) {
      let rightFlare = game.state.rightFlares[index];
      //move to the right
      rightFlare.sprite.x += rightFlare.xSpeed * deltaTime;

      //Check if it hits the wall, then get rid of it
      if (game.boxesIntersect(rightFlare.sprite, game.state.wallRight.sprite)) {
        graphics.app.stage.removeChild(rightFlare.sprite);
        game.state.rightFlares.splice(index, 1);
        game.resetRightWall();
        game.playSound('asteroid_breaking');
      }
    }
  },
  beamPhysics: function (deltaTime) {
    //move beams
    for (let beamIndex = 0; beamIndex < game.state.beams.length; beamIndex++) {
      let beam = game.state.beams[beamIndex];
      //move upward
      beam.sprite.y += beam.ySpeed * deltaTime;
      //if it moves off screen get rid of it
      if (beam.y < -16) {
        graphics.app.stage.removeChild(beam.sprite);
        game.state.beams.splice(beamIndex, 1);
      }
      //check for red asteroids
      for (let index = 0; index < game.state.asteroidFlares.length; index++) {
        let asteroidFlare = game.state.asteroidFlares[index];
        if (game.boxesIntersect(asteroidFlare.sprite, beam.sprite)) {

          graphics.app.stage.removeChild(beam.sprite);
          game.state.beams.splice(beamIndex, 1);

          //remove original asteroid
          graphics.app.stage.removeChild(asteroidFlare.sprite);
          game.playSound('asteroid_breaking');

          //add asteroid pieces
          game.killAsteroidFlare(asteroidFlare);
          game.state.asteroidFlares.splice(index, 1);

          //add to score
          game.state.score++;
          graphics.drawScore(game.state.score);
        }
      }
      //check for asteroids
      for (let index = 0; index < game.state.asteroids.length; index++) {
        let asteroid = game.state.asteroids[index];
        if (game.boxesIntersect(asteroid.sprite, beam.sprite)) {

          graphics.app.stage.removeChild(beam.sprite);
          game.state.beams.splice(beamIndex, 1);

          //remove original asteroid
          graphics.app.stage.removeChild(asteroid.sprite);
          game.playSound('asteroid_breaking');

          //add asteroid pieces
          game.killAsteroid(asteroid);
          game.state.asteroids.splice(index, 1);

          //add to score
          game.state.score++;
          graphics.drawScore(game.state.score);
        }
      }
    }
  }
};
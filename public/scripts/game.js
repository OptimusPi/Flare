debug.log('game.js');

var game = {

  //player
  player: { sprite: null, dead: false, battery: 100, xSpeed: 0, ySpeed: 0, left: 0, right: 0, up: 0, down: 0 },
  shipParts: [],
  beams: [],
  flares: [],
  powerups: [],
  asteroids: [],
  asteroidPieces: [],
  powerupTimer: 0,
  asteroidTimer: 0,
  wallLeft: {},
  wallRight: {},
  score: 0,

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
      var offset = this.data.getLocalPosition(this).x - 16;
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
    graphics.runMenu();
    game.playSound('menu');
    game.updateSound();
  },
  runOverworld: function (mobileMode) {
    game.player.battery = 100;
    game.player.dead = false;
    game.stopSound('menu');
    graphics.runOverworld(mobileMode);
    game.playSound('game');
    game.updateSound();
    game.startScore();

    //connect sprites to physics in game code
    const ticker = new PIXI.ticker.Ticker();
    ticker.stop();
    ticker.add((deltaTime) => {
      game.physics(deltaTime);
    });
    ticker.start();
  },

  //start moving, flag that controls acceleration
  movePlayerLeft: function () {
    game.player.left = -1;
  },
  movePlayerRight: function () {
    game.player.right = 1;
  },
  movePlayerUp: function () {
    game.player.up = -1;
  },
  movePlayerDown: function () {
    game.player.down = 1;
  },
  shootBeam: function () {
    if (this.player.dead === true) return;
    if (this.player.battery === 0) return;

    this.addBattery(-25);

    graphics.addBeam();
  },
  addBattery: function (percent) {
    game.player.battery += percent;

    if (game.player.battery > 100)
      game.player.battery = 100;
    if (game.player.battery < 0)
      game.player.battery = 0;

    if (game.player.battery === 100) graphics.batteryLife.texture = graphics.batteryLifeTexture_100;
    if (game.player.battery === 75) graphics.batteryLife.texture = graphics.batteryLifeTexture_75;
    if (game.player.battery === 50) graphics.batteryLife.texture = graphics.batteryLifeTexture_50;
    if (game.player.battery === 25) graphics.batteryLife.texture = graphics.batteryLifeTexture_25;
    if (game.player.battery === 0) graphics.batteryLife.texture = graphics.batteryLifeTexture_0;
  },
  //stop moving, flag that controls acceleration
  stopPlayerLeft: function () {
    game.player.left = 0;
  },
  stopPlayerRight: function () {
    game.player.right = 0;
  },
  stopPlayerUp: function () {
    game.player.up = 0;
  },
  stopPlayerDown: function () {
    game.player.down = 0;
  },

  shootFlare: function () {
    if(this.player.battery == 100){
      graphics.addFlare();
      this.addBattery(-100);
    }
  },
  resetWalls: function() {
    graphics.wallLeft.x = -500;
    graphics.wallRight.x = 950;
  },
  boxesIntersect: function (a, b) {
    var ab = a.getBounds();
    var bb = b.getBounds();
    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
  },

  startScore: function() {
		game.score = 0;
		graphics.app.ticker.add(function (deltaTime) {
      if (game.player.dead)
        return;

			game.score += 0.0175 * deltaTime;
			graphics.gameScore.text = 'Score:' + Math.floor(game.score);
		});
  },

  killPlayer: function () {
    if (game.player.dead)
      return;

    //Make dead ship pieces
    this.shipParts[0] = {
      sprite: new PIXI.Sprite(graphics.shipPart1Texture), xSpeed: -4, ySpeed: -4, dead: false
    };
    this.shipParts[1] = {
      sprite: new PIXI.Sprite(graphics.shipPart2Texture), xSpeed: 4, ySpeed: -4, dead: false
    };
    this.shipParts[2] = {
      sprite: new PIXI.Sprite(graphics.shipPart3Texture), xSpeed: -4, ySpeed: 4, dead: false
    };
    this.shipParts[3] = {
      sprite: new PIXI.Sprite(graphics.shipPart4Texture), xSpeed: 4, ySpeed: 4, dead: false
    };
    //
    //Position dead ship parts in each corner
    //
    //top left
    this.shipParts[0].sprite.x = game.player.sprite.x;
    this.shipParts[0].sprite.y = game.player.sprite.y;

    //top right
    this.shipParts[1].sprite.x = game.player.sprite.x + 32;
    this.shipParts[1].sprite.y = game.player.sprite.y;

    //bottom left
    this.shipParts[2].sprite.x = game.player.sprite.x;
    this.shipParts[2].sprite.y = game.player.sprite.y + 32;

    //bottom right
    this.shipParts[3].sprite.x = game.player.sprite.x + 32;
    this.shipParts[3].sprite.y = game.player.sprite.y + 32;

    //add ship pieces to the screen
    graphics.app.stage.addChild(game.shipParts[0].sprite);
    graphics.app.stage.addChild(game.shipParts[1].sprite);
    graphics.app.stage.addChild(game.shipParts[2].sprite);
    graphics.app.stage.addChild(game.shipParts[3].sprite);

    //remove original ship
    graphics.app.stage.removeChild(game.player.sprite);

    //mark player as dead
    //TODO game over screen
    game.player.dead = true;
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
    game.asteroidPieces.push(chunks[0]);
    game.asteroidPieces.push(chunks[1]);
    game.asteroidPieces.push(chunks[2]);
  },

  init: function () {
    //Left arrow key press method
    this.left.press = function () {
      game.movePlayerLeft();
    };
    this.left.release = function () {
      game.stopPlayerLeft();
    };

    //Right arrow key press method
    this.space.press = function () {
      game.shootBeam();
    };
    this.right.press = function () {
      game.movePlayerRight();
    };
    this.right.release = function () {
      game.stopPlayerRight();
    };

    //Up arrow key press method
    this.up.press = function () {
      game.movePlayerUp();
    };
    this.up.release = function () {
      game.stopPlayerUp();
    };
    //shift button press
    this.shift.press = function () {
          game.shootFlare();
    };

    //Down arrow key press method
    this.down.press = function () {
      game.movePlayerDown();
    };
    this.down.release = function () {
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
  },

  physics: function (deltaTime) {

    //Ship physics
    if (game.player.dead === false) game.playerPhysics(deltaTime);
    if (game.player.dead === true) game.deadPlayerPhysics(deltaTime);

    //laser beam projectile physics
    game.beamPhysics(deltaTime);
    
    //flare physucs
    game.flarePhysics(deltaTime);

    //asteroids and broken asteroid pieces physics
    game.asteroidPhysics(deltaTime);

    //powerups physics
    game.powerupPhysics(deltaTime);

    //Run out of space!
    game.wallLeft.sprite.x += game.wallLeft.xSpeed * deltaTime;
    game.wallRight.sprite.x += game.wallRight.xSpeed * deltaTime;

    if (this.wallLeft.sprite.x > -100) {
      this.wallLeft.sprite.x = -100;
    }
    if (this.wallRight.sprite.x < 550) {
      this.wallRight.sprite.x = 550;
    }

  },

  deadPlayerPhysics: function (deltaTime) {
    for (var i = 0; i < 4; i++) {
      if (game.shipParts[i].dead === true) continue;
      game.shipParts[i].sprite.x += game.shipParts[i].xSpeed * deltaTime;
      game.shipParts[i].sprite.y += game.shipParts[i].ySpeed * deltaTime;

      //check for walls
      if (this.boxesIntersect(game.shipParts[i].sprite, game.wallLeft.sprite) ||
        this.boxesIntersect(game.shipParts[i].sprite, game.wallRight.sprite)) {
        graphics.app.stage.removeChild(this.shipParts[i].sprite);
        game.shipParts[i].dead = true;
      }
    }
  },

  powerupPhysics: function (deltaTime) {
    //spawn powerups 
    this.powerupTimer += deltaTime;
    if (this.powerupTimer > 200 && game.player.dead === false) {
      graphics.addPowerup();
      this.powerupTimer = 0;
    }

    //move powerups
    game.powerups.forEach(function (powerup, index, object) {
      powerup.sprite.y += powerup.ySpeed;

      if (game.boxesIntersect(powerup.sprite, game.player.sprite)) {
        graphics.app.stage.removeChild(powerup.sprite);
        game.powerups.splice(index, 1);
        game.addBattery(100);
      }
    });
  },
  asteroidPhysics: function (deltaTime) {
    //spawn asteroids 
    game.asteroidTimer += deltaTime;
    if (game.asteroidTimer > 80 && game.player.dead == false) {
      graphics.addAsteroid();
      game.asteroidTimer = 0;
    }

    //move asteroids
    game.asteroids.forEach(function (asteroid, index, object) {
      asteroid.sprite.y += asteroid.ySpeed;
      asteroid.sprite.x += asteroid.xSpeed;

      //this this asteroid hits players it kills them
      if (game.player.dead == false && game.boxesIntersect(asteroid.sprite, game.player.sprite)) {
        graphics.app.stage.removeChild(asteroid.sprite);
        game.asteroids.splice(index, 1);
        game.killPlayer();
        graphics.gameOver();
      }

      //bounce off the walls! 
      if (game.boxesIntersect(game.wallLeft.sprite, asteroid.sprite)) {
        asteroid.xSpeed *= -1;//bounce off the walls! 
        asteroid.sprite.x += 2;
      }
      if (game.boxesIntersect(game.wallRight.sprite, asteroid.sprite)) {
        asteroid.xSpeed *= -1;//bounce off the walls! 
        asteroid.sprite.x -= 2.0;
      }

      //disappear off screen
      if (asteroid.y > 640) {
        graphics.app.stage.removeChild(asteroid.sprite);
        game.asteroids.splice(index, 1);
      }
    });

    //move dead asteroid pieces
    game.asteroidPieces.forEach(function (asteroidPiece, index, object) { 
      asteroidPiece.sprite.y += asteroidPiece.ySpeed;
      asteroidPiece.sprite.x += asteroidPiece.xSpeed;

      //disappear off screen
      if (asteroidPiece.y < -32) {
        graphics.app.stage.removeChild(asteroidPiece.sprite);
        game.asteroidPieces.splice(index, 1);
      }
    });
  },
  
  playerPhysics: function (deltaTime) {
    //Accelerate ship
    var maxHorizontal = 4;
    var maxVertical = 4;
    horizontal = this.player.right + this.player.left;
    vertical = this.player.down + this.player.up;
    
    //X
    this.player.xSpeed += horizontal * 0.32 * deltaTime;
    if (this.player.xSpeed > maxHorizontal) this.player.xSpeed = maxHorizontal;
    if (this.player.xSpeed < -maxHorizontal) this.player.xSpeed = -maxHorizontal;
    if (horizontal === 0) this.player.xSpeed *= 0.92 * deltaTime;

    //Y
    this.player.ySpeed += vertical * 0.32 * deltaTime;
    if (this.player.ySpeed > maxVertical) this.player.ySpeed = maxVertical;
    if (this.player.ySpeed < -maxVertical) this.player.ySpeed = -maxVertical;
    if (vertical === 0) this.player.ySpeed *= 0.92 * deltaTime;

    //Move ship based on it's calculated 
    this.player.sprite.x += this.player.xSpeed * deltaTime;
    this.player.sprite.y += this.player.ySpeed * deltaTime;

    //Display ship boosters
    if (horizontal !== 0 || vertical !== 0) {
      //TODO put animations in graphics.js ?
      game.player.sprite.frame += deltaTime;
      if (game.player.sprite.frame % 8 < 8) game.player.sprite.texture = graphics.shipBoosting3Texture;
      if (game.player.sprite.frame % 8 < 5) game.player.sprite.texture = graphics.shipBoosting2Texture;
      if (game.player.sprite.frame % 8 < 2) game.player.sprite.texture = graphics.shipBoosting1Texture;
    } else {
      game.player.sprite.frame = 0;
      game.player.sprite.frame += deltaTime;
      if (game.player.sprite.frame % 8 < 8) game.player.sprite.texture = graphics.shipTexture;
      if (game.player.sprite.frame % 8 < 4) game.player.sprite.texture = graphics.shipBoosting1Texture;
    }
    //bounce off the walls! 
    if (game.boxesIntersect(this.wallLeft.sprite, game.player.sprite)) {
      game.player.xSpeed *= -1.5;//bounce off the walls! 
      game.player.sprite.x += 1.5;
    }
    if (game.boxesIntersect(this.wallRight.sprite, game.player.sprite)) {
      game.player.xSpeed *= -1.5;//bounce off the walls! 
      game.player.sprite.x -= 1.5;
    }
  },

  flarePhysics: function (deltaTime) {
    //move flares to the right
    game.flares.forEach(function (flare, index, object) {
      //move to the right
      flare.sprite.x += flare.xSpeed * deltaTime;

      //Check if it hits the wall, then get rid of it
      if (game.boxesIntersect(flare.sprite, game.wallRight.sprite)){
        graphics.app.stage.removeChild(flare.sprite);
        game.resetWalls();
      }
    });
  },
  beamPhysics: function (deltaTime) {
    //move beams
    game.beams.forEach(function (beam, beamIndex, object) {
      //move upward
      beam.sprite.y += beam.ySpeed * deltaTime;
      //if it moves off screen get rid of it
      if (beam.y < -16) {
        graphics.app.stage.removeChild(beam.sprite);
        game.beams.splice(beamIndex, 1);
      }
      //check for asteroids
      game.asteroids.forEach(function (asteroid, index, object) {
        if (game.boxesIntersect(asteroid.sprite, beam.sprite)) {

          graphics.app.stage.removeChild(beam.sprite);
          game.beams.splice(beamIndex, 1);

          //remove original asteroid
          graphics.app.stage.removeChild(asteroid.sprite);

          //add asteroid pieces
          game.killAsteroid(asteroid);
          game.asteroids.splice(index, 1);
        }
      });
    });
  }
}


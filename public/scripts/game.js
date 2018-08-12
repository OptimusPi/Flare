debug.log('game.js');

var game = {

  //player
  player: { sprite: null, dead: false, battery: 100, xSpeed: 0, ySpeed: 0, left: 0, right: 0, up: 0, down: 0 },
  shipParts: [],
  beams: [],
  powerups: [],
  asteroids: [],
  powerupTimer: 0,
  asteroidTimer: 0,
  wallLeft: {},
  wallRight: {},

  //keyboard arrow keys
  left: keyboard(37),
  up: keyboard(38),
  right: keyboard(39),
  down: keyboard(40),
  space: keyboard(32),

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
      var newPosition =
        this.data.getLocalPosition(this.parent);
      if (newPosition.x > 134) {
        newPosition.x = 134;
      }
      if (newPosition.x < 34) {
        newPosition.x = 34;
      }
      this.x = newPosition.x;
      game.updateSound();
    }
  },

  playSound: function (sound) {
    PIXI.sound.play(sound);
  },
  stopSound: function (sound) {
    PIXI.sound.play(sound);
  },
  updateSound: function () {
    PIXI.sound.volumeAll = 1 - ((134 - graphics.volumeSlider.x) / 100);
  },
  runMenu: function () {
    graphics.runMenu();
    game.playSound('menu');
  },
  runOverworld: function () {
    graphics.runOverworld();
    game.playSound('game');
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
  shootProjectile: function () {
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
    //TODO shoot flare
  },

  boxesIntersect: function (a, b) {
    var ab = a.getBounds();
    var bb = b.getBounds();
    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
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

  init: function () {
    //Left arrow key press method
    this.left.press = function () {
      game.movePlayerLeft();
      debug.log('I pressed left.');
    };
    this.left.release = function () {
      game.stopPlayerLeft();
      debug.log('I released left.');
    };

    //Right arrow key press method
    this.space.press = function () {
      game.shootProjectile();
      debug.log('I shot a projectile');
    };
    this.right.press = function () {
      game.movePlayerRight();
      debug.log('I pressed right.');
    };
    this.right.release = function () {
      game.stopPlayerRight();
      debug.log('I released right.');
    };

    //Up arrow key press method
    this.up.press = function () {
      game.movePlayerUp();
      debug.log('I pressed up.');
    };
    this.up.release = function () {
      game.stopPlayerUp();
      debug.log('I released up.');
    };

    //Down arrow key press method
    this.down.press = function () {
      game.movePlayerDown();
      debug.log('I pressed down.');
    };
    this.down.release = function () {
      game.stopPlayerDown();
      debug.log('I released down.');
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

    //move beams
    game.beams.forEach(function (beam, index, object) {
      beam.sprite.y += beam.ySpeed;
      if (beam.y < -16) {
        graphics.app.stage.removeChild(beam.sprite);
        game.beams.splice(index, 1);
      }
      //TODO collision detection with asteroids
    });


    //spawn powerups 
    this.powerupTimer += deltaTime;
    if (this.powerupTimer > 1800) {
      graphics.addPowerup();
      this.powerupTimer = 0;
    }

    //spawn asteroids 
    this.asteroidTimer += deltaTime;
    if (this.asteroidTimer > 90) {
      graphics.addAsteroid();
      this.asteroidTimer = 0;
    }

    //move asteroids
    game.asteroids.forEach(function (asteroid, index, object) {
      asteroid.sprite.y += asteroid.ySpeed;
      asteroid.sprite.x += asteroid.xSpeed;

      //this this asteroid hits players it kills them
      if (game.boxesIntersect(asteroid.sprite, game.player.sprite)) {
        graphics.app.stage.removeChild(asteroid.sprite);
        game.asteroids.splice(index, 1);
        game.killPlayer();
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

    //move powerups
    game.powerups.forEach(function (powerup, index, object) {
      powerup.sprite.y += powerup.ySpeed;

      if (game.boxesIntersect(powerup.sprite, game.player.sprite)) {
        graphics.app.stage.removeChild(powerup.sprite);
        game.powerups.splice(index, 1);
        game.addBattery(50);
      }
    });



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
  playerPhysics: function (deltaTime) {
    //Accelerate ship
    var maxHorizontal = 6;
    var maxVertical = 6;
    horizontal = this.player.right + this.player.left;
    vertical = this.player.down + this.player.up;
    //X
    this.player.xSpeed += horizontal * 0.4 * deltaTime;
    if (this.player.xSpeed > maxHorizontal) this.player.xSpeed = maxHorizontal;
    if (this.player.xSpeed < -maxHorizontal) this.player.xSpeed = -maxHorizontal;
    if (horizontal === 0) this.player.xSpeed *= 0.8 * deltaTime;

    //Y
    this.player.ySpeed += vertical * 0.4 * deltaTime;
    if (this.player.ySpeed > maxVertical) this.player.ySpeed = maxVertical;
    if (this.player.ySpeed < -maxVertical) this.player.ySpeed = -maxVertical;
    if (vertical === 0) this.player.ySpeed *= 0.8 * deltaTime;

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
      game.player.xSpeed *= -1.75;//bounce off the walls! 
      game.player.sprite.x += 2;
    }
    if (game.boxesIntersect(this.wallRight.sprite, game.player.sprite)) {
      game.player.xSpeed *= -1.75;//bounce off the walls! 
      game.player.sprite.x -= 2.0;
    }
  }
}


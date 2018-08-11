debug.log('game.js');

var game = {

  //player
  player: { sprite: null, battery: 100, xSpeed: 0, ySpeed: 0, left: 0, right: 0, up: 0, down: 0 },
  beams: {}, //TODO do I need this?

  //keyboard arrow keys
  left: keyboard(37),
  up: keyboard(38),
  right: keyboard(39),
  down: keyboard(40),
  space: keyboard(32),

  //Functions
  onDragStart: function(event){
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
  },

  onDragEnd: function(){
    this.alpha = 1;
    this.dragging = false;
    this.data= null;
  },

  onDragMove: function(){
    if (this.dragging) {
      var newPosition =
        this.data.getLocalPosition(this.parent);
        if (newPosition.x > 134){
          newPosition.x = 134;
        }
        if (newPosition.x < 34){
          newPosition.x = 34;
        }
        this.x = newPosition.x;
        PIXI.sound.volumeAll = 1 - ((134-graphics.volumeSlider.x)/100);
    }
  },

  playSound: function(sound){
    PIXI.sound.play(sound);
  },
  stopSound: function (sound) {
    PIXI.sound.play(sound);
  },
  updateSound: function(){
    PIXI.sound.volumeAll = 1 - ((134-graphics.volumeSlider.x)/100);
  },
  runMenu: function(){
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
    if(this.player.battery > 0) this.player.battery = this.player.battery - 25;
    if(this.player.battery == 75) graphics.batteryLife_100.texture = graphics.batteryLife_75.texture;
    if(this.player.battery == 50) graphics.batteryLife_100.texture = graphics.batteryLife_50.texture;
    if(this.player.battery == 25) graphics.batteryLife_100.texture = graphics.batteryLife_25.texture;
    if(this.player.battery == 0) graphics.batteryLife_100.texture = graphics.batteryLife_0.texture;
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
    //Accelerate ship
    var maxHorizontal = 10;
    var maxVertical = 10;
    horizontal = this.player.right + this.player.left;
    vertical = this.player.down + this.player.up;
    //X
    this.player.xSpeed += horizontal * 0.8 * deltaTime;
    if (this.player.xSpeed >  maxHorizontal) this.player.xSpeed = maxHorizontal;
    if (this.player.xSpeed < -maxHorizontal) this.player.xSpeed = -maxHorizontal;
    if (horizontal === 0) this.player.xSpeed *= 0.8 * deltaTime;

    //Y
    this.player.ySpeed += vertical * 0.8 * deltaTime;
    if (this.player.ySpeed >  maxVertical) this.player.ySpeed = maxVertical;
    if (this.player.ySpeed < -maxVertical) this.player.ySpeed = -maxVertical; 
    if (vertical === 0) this.player.ySpeed *= 0.8 * deltaTime;

    //Move ship based on it's calculated 
    this.player.sprite.x += this.player.xSpeed * deltaTime;
    this.player.sprite.y += this.player.ySpeed * deltaTime;

    //Display ship boosters
    if (horizontal !== 0 || vertical !== 0)
    {
      //TODO put animations in graphics.js ?
      var coords = this.player.sprite.x + this.player.sprite.y;

      game.player.sprite.frame += deltaTime;
      if (game.player.sprite.frame % 20 < 20) game.player.sprite.texture = graphics.ship.texture;
      if (game.player.sprite.frame % 20 < 15) game.player.sprite.texture = graphics.shipBoosting3.texture;
      if (game.player.sprite.frame % 20 < 10) game.player.sprite.texture = graphics.shipBoosting2.texture;
      if (game.player.sprite.frame % 20 < 5) {
        game.player.sprite.texture = graphics.shipBoosting1.texture;
      }
    } else {
      game.player.sprite.texture = graphics.ship.texture;
      game.player.sprite.frame = 0;
    }
  }
}



debug.log('game.js');
  
var game = {
  //keyboard arrow keys
  left: keyboard(37),
  up: keyboard(38),
  right: keyboard(39),
  down: keyboard(40),

  //Functions
  playSound: function(sound){
    PIXI.sound.play(sound);
  },
  stopSound: function(sound){
    PIXI.sound.play(sound);
  },
  runMenu: function(){
    graphics.runMenu();
    game.playSound('menu');
  },
  runOverworld: function(){
    graphics.runOverworld();
    game.playSound('game');
  },
  movePlayerLeft: function(){
    graphics.player.sprite.x -= 1;
  },
  movePlayerRight: function(){
    graphics.player.sprite.x += 1;
  },
  movePlayerUp: function(){
    graphics.player.sprite.y -= 1;
  },
  movePlayerDown: function(){
    graphics.player.sprite.y += 1;
  },
  fireFlare: function(){
    //TODO fire flare
  },
  init: function(){
    //Left arrow key press method
    this.left.press = function() {
      game.movePlayerLeft();
      debug.log('I pressed left.');
    };
    
    //Right arrow key press method
    this.right.press = function() {
      game.movePlayerRight();
      debug.log('I pressed right.');
    };
    
    //Up arrow key press method
    this.up.press = function() {
      game.movePlayerUp();
      debug.log('I pressed up.');
    };
    
    //Down arrow key press method
    this.down.press = function() {
        game.movePlayerDown();
        debug.log('I pressed down.');
    };

    //Game music
    PIXI.sound.add('game', {
        url: 'sounds/game.ogg', 
        loop: true
    });
    //Menu music
    PIXI.sound.add('menu', {
        url: 'sounds/menu.ogg',
        loop: true
    });
  }
}



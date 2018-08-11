debug.log('game.js');
  
var game = {
  //keyboard arrow keys
  left: keyboard(37),
  up: keyboard(38),
  right: keyboard(39),
  down: keyboard(40),

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
  stopSound: function(sound){
    PIXI.sound.play(sound);
  },
  updateSound: function(){
    PIXI.sound.volumeAll = 1 - ((134-graphics.volumeSlider.x)/100);
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
    //TODO move left
  },
  movePlayerRight: function(){
    //TODO move right
  },
  movePlayerUp: function(){
    //TODO move up
  },
  movePlayerDown: function(){
    //TODO move down
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
        loop: true,
    });
    //Menu music
    PIXI.sound.add('menu', {
        url: 'sounds/menu.ogg',
        loop: true,
    });
  }
}



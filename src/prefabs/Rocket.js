// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame);
  
      // add object to existing scene
      scene.add.existing(this);
      this.isFiring = false;
      this.moveSpeed = 2;
      this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx
      this.mouseControl = false;
      this.prevMouse = game.input.mousePointer.x;
      this.pointer = game.input.activePointer;
    }

    update() {
        //left/right movement
        

        if(keyLEFT.isDown && this.x >= borderUISize + this.width){
            this.mouseControl = false;
            this.x -= this.moveSpeed;
        } else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
            this.mouseControl = false;
            this.x += this.moveSpeed;
        }
    
        
        if(game.input.mousePointer.x != this.prevMouse) {
            this.mouseControl = true;
        }
        this.prevMouse = game.input.mousePointer.x;

        if (this.mouseControl){
            this.x = this.prevMouse;
        }

        //fire button
        if(Phaser.Input.Keyboard.JustDown(keyF) || this.pointer.isDown) {
            this.isFiring = true;
            this.sfxRocket.play();  // play sfx
        }
        
        //if fired, move up
        if(this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed;
        }

        //reset on miss
        if(this.y <= borderUISize * 3 + borderPadding) {
            this.isFiring = false;
            this.y = game.config.height - borderUISize - borderPadding;

        }
    }

    reset() {
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }
}
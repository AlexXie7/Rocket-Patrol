//Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue){
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.points = pointValue;
        this.moveSpeed = game.settings.spaceshipSpeed;
    }

    update() {
        //move spaceship left
        this.x -= this.moveSpeed;
        //wrap from left to right
        if(this.x <= 0 - this.width) {
            this.x = game.config.width;
        }

        if(this.x >= game.config.width + this.width){
            this.x = 0 - this.width;
        }
    }

    reset() {
        this.x = game.config.width;
    }
}
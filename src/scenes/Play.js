class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('base', './assets/base.png');
        this.load.image('parallax1', './assets/parallax1.png');
        this.load.image('parallax2', './assets/parallax2.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.spritesheet('angry', './assets/angry.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 1})
        this.load.spritesheet('happy', './assets/happy.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 1})        
        // load explosion particle
        this.load.image('red', './assets/red.png');
        // load music
        this.load.audio('bgm', './assets/EthernightClub.mp3')
    }

    create() {
        // BGM
        this.BGM = this.sound.add('bgm'); // add BGM
        this.BGM.play();  // play sfx

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // place tile sprite
        this.base = this.add.tileSprite(0, 0, 640, 480, 'base').setOrigin(0, 0);
        this.parallax1 = this.add.tileSprite(0, 0, 640, 480, 'parallax1').setOrigin(0, 0);
        this.parallax2 = this.add.tileSprite(0, 0, 640, 480, 'parallax2').setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        this.anims.create({
            key: 'anger',
            frames: this.anims.generateFrameNumbers('angry', {start: 0, end: 1, first: 0}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'haper',
            frames: this.anims.generateFrameNumbers('happy', {start:0, end: 1, first: 0}),
            frameRate: 5,
            repeat: -1
        });

        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'happy').setOrigin(0.5, 0);
        // add rocket animation
        this.p1Rocket.play('haper')
        
        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'angry', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'angry', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'angry', 0, 10).setOrigin(0,0);

        // add spaceship animations (x3)
        this.ship01.play('anger');
        this.ship02.play('anger');
        this.ship03.play('anger');

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 15
        });


        // initialize score
        this.p1Score = 0;
        this.timeLeft = 7200;

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft  = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
        this.scoreRight = this.add.text(game.config.width - borderUISize - borderPadding - scoreConfig.fixedWidth, borderUISize + borderPadding*2, hiScore, scoreConfig);
        this.timeMid    = this.add.text(game.config.width/2 - scoreConfig.fixedWidth/2, borderUISize + borderPadding*2, this.timeLeft, scoreConfig);

        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(60000, () => {
            if(this.p1Score > hiScore){
                hiScore = this.p1Score
            }

            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true
        }, null, this);
    }

    update() {
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        //check input for menu
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        } 

        
        //reduce displayed time
        if (this.timeLeft > 0) {
            this.timeLeft -= 1;
            this.timeMid.text = Math.floor(this.timeLeft / 120);
        }

        this.base.tilePositionX -= 0.5;
        this.parallax1.tilePositionX -= 1;
        this.parallax2.tilePositionX -= 1.5;
        if(!this.gameOver) {
            this.p1Rocket.update();
            this.ship01.update();               // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
        }

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03)
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02)
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01)
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);

        //explosion particles
        let emitter0 = this.add.particles('red').createEmitter({
            x: ship.x,
            y: ship.y,
            speed: { min: -800, max: 800 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            blendMode: 'SCREEN',
            //active: false,
            lifespan: 600,
            gravityY: 800
        }); 

        // Particle emitter
        emitter0.explode();
        emitter0.explode();
        emitter0.explode();
        emitter0.explode();

        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
          ship.reset();                         // reset ship position
          ship.alpha = 1;                       // make ship visible again
          boom.destroy();                       // remove explosion sprite
        });       

        //score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_explosion');
    }
}
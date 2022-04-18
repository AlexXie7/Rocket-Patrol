/**
 * Name: Alex Xie
 * Project: Rocket Patrol Mods
 * Date: 4/18/22
 * Time to Complete: 169 hours? Idk probably like 10 hrs or less but also I wasn't super focused while doing it
 * 
 * Points Breakdown:
 * Track a high score that persists across scenes and display it in the UI (5)
 * Add your own (copyright-free) background music to the Play scene (5)
 * Display the time remaining (in seconds) on the screen (10)
 * Implement mouse control for player movement and mouse click to fire (20)
 * Implement parallax scrolling (10)
 * Create a new animated sprite for the Spaceship enemies (10)
 * Use Phaser's particle emitter to create a particle explosion when the rocket hits the spaceship (20)
 * Allow the player to control the Rocket after it's fired (5)
 * Randomize each spaceship's movement direction at the start of each play (5)
 * Create new artwork for all of the in-game assets (rocket, spaceships, explosion) (20)
 * Total Points: 110/100 
 * 
 * All Art Assets from Daphne Cheng!
 * Music is Ethernight Club by Kevin Macleod
 **/



let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
    }

let game = new Phaser.Game(config);

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;

let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

let hiScore = 0;
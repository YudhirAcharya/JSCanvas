import "./style.css";
import Phaser from "phaser";
const speedDown = 300;
const sizes = {
  width: 500,
  height: 500,
};
// scene is the stage
class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.player;
    this.cursor;
    this.playerSpeed = speedDown + 50;
    this.target;
    this.points = 0;
    this.textTime;
    this.timedEvent;
    this.remainingTime;
  }
  preload() {
    this.load.image("bg", "/assets/bg.png");
    this.load.image("basket", "/assets/basket.png");
    this.load.image("apple", "/assets/apple.png");
  }
  //add img to scene
  create() {
    this.add.image(0, 0, "bg").setOrigin(0, 0);
    this.player = this.physics.add
      .image(0, sizes.height - 100, "basket")
      .setOrigin(0, 0);
    this.target = this.physics.add
      .image(0, 0, "apple")
      .setOrigin(0, 0);
    this.player.setSize(80, 15).setOffset(10, 50);
    this.player.setImmovable(true);
    this.player.setCollideWorldBounds = true;
    this.player.body.allowGravity = false;
    this.target.setMaxVelocity(0, speedDown);
    this.physics.add.overlap(
      this.target,
      this.player,
      this.targetHit,
      null,
      this
    );
    this.cursor = this.input.keyboard.createCursorKeys();

    this.textScore = this.add.text(
      sizes.width - 120,
      10,
      "Score:0",
      {
        font: "25px Arial",
        fill: "#000000",
      }
    );
    this.textTime = this.add.text(10, 10, "Time:00", {
      font: "25px Arial",
      fill: "#000000",
    });
    this.timedEvent = this.time.delayedCall(
      3000,
      this.gameOver,
      [],
      this
    );
  }
  update() {
    this.remainingTime =
      this.timedEvent.getRemainingSeconds();
    this.textTime.setText(
      `Remaing Time: ${Math.round(
        this.remainingTime
      ).toString()}`
    );
    if (this.target.y >= sizes.height) {
      this.target.setY(0);
      this.target.setX(this.getRandomX());
    }

    //cursor controls
    const { left, right } = this.cursor;

    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
    } else {
      this.player.setVelocityX(0);
    }
  }

  getRandomX() {
    return Math.floor(Math.random() * 480);
  }
  targetHit() {
    this.target.setY(0);
    this.target.setX(this.getRandomX());
    this.points++;
    console.log(`Scored! ${this.points}`);
    this.textScore.setText(`Score:${this.points}`);
  }
  gameOver() {
    console.log("GAme OVer");
  }
}
const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: speedDown },
      degbug: true,
    },
  },
  scene: [GameScene],
};

const game = new Phaser.Game(config);

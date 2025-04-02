import Phaser from "phaser";
import GameScene from "../scenes/GameScene"; // Import du GameScene

export default class Character extends Phaser.Physics.Arcade.Sprite {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private keys!: { [key: string]: Phaser.Input.Keyboard.Key };
    private lastDirection: "down" | "left" | "right" | "up" = "down";
    private map; // La map est récupérée directement depuis la scène

    private moving = false; // ✅ Empêche le mouvement en cours d'exécution
    private tileSize = 32; // ✅ Assure un mouvement en pas de 32px

    constructor(scene: GameScene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);

        this.map = scene.getMap(); // On récupère directement la carte depuis la scène

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setSize(40, 42);
        this.setOffset(12, 20);
        this.setScale(0.75);

        const tileX =
            Math.round(x / this.tileSize) * this.tileSize + this.tileSize / 2;
        const tileY =
            Math.round(y / this.tileSize) * this.tileSize +
            this.tileSize -
            (this.height * 0.75) / 2;
        this.setPosition(tileX, tileY);

        if (scene.input.keyboard) {
            this.cursors = scene.input.keyboard.createCursorKeys();
            this.keys = {
                Z: scene.input.keyboard.addKey(
                    Phaser.Input.Keyboard.KeyCodes.Z
                ),
                Q: scene.input.keyboard.addKey(
                    Phaser.Input.Keyboard.KeyCodes.Q
                ),
                S: scene.input.keyboard.addKey(
                    Phaser.Input.Keyboard.KeyCodes.S
                ),
                D: scene.input.keyboard.addKey(
                    Phaser.Input.Keyboard.KeyCodes.D
                ),
            };
        }

        this.createAnimations(scene);
        scene.cameras.main.startFollow(this);
    }

    private createAnimations(scene: Phaser.Scene) {
        const directions = ["down", "left", "right", "up"];
        directions.forEach((dir, index) => {
            scene.anims.create({
                key: `walk-${dir}`,
                frames: scene.anims.generateFrameNumbers("player", {
                    start: index * 4,
                    end: index * 4 + 3,
                }),
                frameRate: 8,
                repeat: -1,
            });

            scene.anims.create({
                key: `idle-${dir}`,
                frames: [{ key: "player", frame: index * 4 }],
            });
        });
    }

    private handleMovement() {
        if (this.moving) return; // ✅ Empêche de bouger en plein déplacement

        let targetX = this.x;
        let targetY = this.y;

        if (this.cursors.left?.isDown || this.keys.Q.isDown) {
            const tile = this.map.getTileAt(this.x - this.tileSize, this.y);
            this.lastDirection = "left";
            this.anims.play("walk-left", true);

            if (!tile?.blocking) {
                targetX -= this.tileSize;
            }
        } else if (this.cursors.right?.isDown || this.keys.D.isDown) {
            const tile = this.map.getTileAt(this.x + this.tileSize, this.y);
            this.lastDirection = "right";
            this.anims.play("walk-right", true);

            if (!tile?.blocking) {
                targetX += this.tileSize;
            }
        } else if (this.cursors.up?.isDown || this.keys.Z.isDown) {
            const tile = this.map.getTileAt(this.x, this.y - this.tileSize);
            this.lastDirection = "up";
            this.anims.play("walk-up", true);

            if (!tile?.blocking) {
                targetY -= this.tileSize;
            }
        } else if (this.cursors.down?.isDown || this.keys.S.isDown) {
            const tile = this.map.getTileAt(this.x, this.y + this.tileSize);
            this.lastDirection = "down";
            this.anims.play("walk-down", true);

            if (!tile?.blocking) {
                targetY += this.tileSize;
            }
        } else {
            this.anims.play(`idle-${this.lastDirection}`);
            return;
        }

        this.moving = true;
        this.scene.tweens.add({
            targets: this,
            x: targetX,
            y: targetY,
            duration: 200,
            onComplete: () => {
                this.moving = false;
                //console.log(this.x, this.y);
            },
        });
    }

    update() {
        this.handleMovement();
    }
}


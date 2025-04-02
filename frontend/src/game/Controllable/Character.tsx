import Phaser from "phaser";
import Map from "../scenes/Map";

export default class Character extends Phaser.Physics.Arcade.Sprite {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private keys!: { [key: string]: Phaser.Input.Keyboard.Key };
    private lastDirection: "down" | "left" | "right" | "up" = "down";
    private map: Map;

    private moving = false; // ✅ Prevents movement mid-step
    private tileSize = 32; // ✅ Ensure movement follows tile size

    constructor(
        scene: Phaser.Scene,
        map: Map,
        x: number,
        y: number,
        texture: string
    ) {
        super(scene, x, y, texture);

        this.map = map;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setSize(40, 42);
        this.setOffset(12, 20); // 🔹 Ajuste l’offset selon ton sprite
        this.setScale(0.75);

        // ✅ Taille de la tile (change si nécessaire)
        const tileSize = 32;

        // ✅ Centrage horizontal + Alignement vertical bas
        const tileX = Math.round(x / tileSize) * tileSize + tileSize / 2;
        const tileY =
            Math.round(y / tileSize) * tileSize +
            tileSize -
            (this.height * 0.75) / 2;

        this.setPosition(tileX, tileY);

        // Initialisation des touches
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
        if (this.moving) return; // ✅ Prevent new movement until current is done

        let targetX = this.x;
        let targetY = this.y;

        if (this.cursors.left?.isDown || this.keys.Q.isDown) {
            const tile = this.map.getTileAt(this.x - this.tileSize, this.y);
            this.lastDirection = "left"; // Change direction even if blocked
            this.anims.play("walk-left", true);

            if (!tile?.blocking) {
                targetX -= this.tileSize; // Move if not blocked
            }
        } else if (this.cursors.right?.isDown || this.keys.D.isDown) {
            const tile = this.map.getTileAt(this.x + this.tileSize, this.y);
            this.lastDirection = "right"; // Change direction even if blocked
            this.anims.play("walk-right", true);

            if (!tile?.blocking) {
                targetX += this.tileSize; // Move if not blocked
            }
        } else if (this.cursors.up?.isDown || this.keys.Z.isDown) {
            const tile = this.map.getTileAt(this.x, this.y - this.tileSize);
            this.lastDirection = "up"; // Change direction even if blocked
            this.anims.play("walk-up", true);

            if (!tile?.blocking) {
                targetY -= this.tileSize; // Move if not blocked
            }
        } else if (this.cursors.down?.isDown || this.keys.S.isDown) {
            const tile = this.map.getTileAt(this.x, this.y + this.tileSize);
            this.lastDirection = "down"; // Change direction even if blocked
            this.anims.play("walk-down", true);

            if (!tile?.blocking) {
                targetY += this.tileSize; // Move if not blocked
            }
        } else {
            this.anims.play(`idle-${this.lastDirection}`);
            return;
        }

        // Si un mouvement est possible, commence l'animation de déplacement
        this.moving = true;
        this.scene.tweens.add({
            targets: this,
            x: targetX,
            y: targetY,
            duration: 200,
            onComplete: () => {
                this.moving = false;
                console.log(this.x, this.y);
            },
        });
    }

    update() {
        this.handleMovement();
    }
}


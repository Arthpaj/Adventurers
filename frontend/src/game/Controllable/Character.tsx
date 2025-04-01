import Phaser from "phaser";

export default class Character extends Phaser.Physics.Arcade.Sprite {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private keys!: { [key: string]: Phaser.Input.Keyboard.Key };
    private lastDirection: "down" | "left" | "right" | "up" = "down";

    private moving = false; // ✅ Prevents movement mid-step
    private tileSize = 32; // ✅ Ensure movement follows tile size

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);

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
            targetX -= this.tileSize;
            this.lastDirection = "left";
            this.anims.play("walk-left", true);
        } else if (this.cursors.right?.isDown || this.keys.D.isDown) {
            targetX += this.tileSize;
            this.lastDirection = "right";
            this.anims.play("walk-right", true);
        } else if (this.cursors.up?.isDown || this.keys.Z.isDown) {
            targetY -= this.tileSize;
            this.lastDirection = "up";
            this.anims.play("walk-up", true);
        } else if (this.cursors.down?.isDown || this.keys.S.isDown) {
            targetY += this.tileSize;
            this.lastDirection = "down";
            this.anims.play("walk-down", true);
        } else {
            this.anims.play(`idle-${this.lastDirection}`);
            return;
        }

        this.moving = true;

        // ✅ Move exactly 1 tile and ensure alignment
        this.scene.tweens.add({
            targets: this,
            x: targetX,
            y: targetY,
            duration: 200, // Adjust speed here
            onComplete: () => {
                this.moving = false;
            },
        });
    }

    update() {
        this.handleMovement();
    }
}


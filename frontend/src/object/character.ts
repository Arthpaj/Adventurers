import { getSpriteData } from "../game/dictionary/spriteDictionary"; // Importation de ta fonction
import { Inventory } from "./inventory";
import { Being } from "./being";
import { Job } from "./job";
import { GameScene } from "../game/scenes/GameScene";
import Map from "./map";

export class Character extends Being {
    spriteKey: string; // Le spriteKey passé pour rechercher dans le dictionnaire
    private health: number;
    private maxHealth: number;
    private level: number;
    private xp: number;
    private maxXp: number;
    private jobs: Job[];
    private inventory: Inventory;
    private currentLayer: number;
    private levelMaxReached: boolean = false; // ✅ Indique si le joueur a atteint le niveau maximum

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private keys!: { [key: string]: Phaser.Input.Keyboard.Key };
    private lastDirection: "down" | "left" | "right" | "up" = "down";
    private map: Map; // La map est récupérée directement depuis la scène

    private moving = false;
    private tileSize = 32;

    constructor(
        scene: GameScene,
        id: string,
        x: number,
        y: number,
        name: string,
        spriteKey: string,
        level: number = 1,
        xp: number = 0,
        maxXp: number = 20
    ) {
        super(scene, id, x, y, name, spriteKey);
        this.level = level;
        this.xp = xp;
        this.maxXp = maxXp;
        this.spriteKey = spriteKey; // Récupérer la clé du sprite

        // Charger les données du sprite à partir du dictionnaire
        const spriteData = getSpriteData(spriteKey);
        if (!spriteData) {
            console.error(
                `Sprite data for ${spriteKey} not found in spriteDictionary!`
            );
            return;
        }
        this.map = scene.getMap();

        // Vérifie si le sprite existe déjà (créé dans GameScene)

        this.setScale(0.75);
        this.setDepth(2);

        // Applique la taille du sprite
        this.setSize(40, 42);
        this.setOffset(12, 20);

        scene.add.existing(this);
        scene.physics.add.existing(this);

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

        this.createAnimations(scene); // Crée les animations avec la clé du sprite
        scene.cameras.main.startFollow(this);
    }

    private createAnimations(scene: Phaser.Scene) {
        const spriteData = getSpriteData(this.spriteKey);
        if (!spriteData) return;

        const directions = ["down", "left", "right", "up"];
        directions.forEach((dir, index) => {
            scene.anims.create({
                key: `walk-${dir}`,
                frames: scene.anims.generateFrameNumbers(this.spriteKey, {
                    start: index * 4,
                    end: index * 4 + 3,
                }),
                frameRate: 8,
                repeat: -1,
            });

            scene.anims.create({
                key: `idle-${dir}`,
                frames: [
                    {
                        key: this.spriteKey,
                        frame: index * 4,
                    },
                ],
            });
        });
    }

    private handleMovement() {
        if (this.moving) return;

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
            },
        });
    }

    checkPlayer() {
        if (!this.levelMaxReached) {
            if (this.xp >= this.maxXp) {
                this.levelUp();
            }
        }
    }

    private levelUp() {
        this.level++;
        this.maxHealth += 10;
        this.health = this.maxHealth;
        this.xp = this.xp - this.maxXp;
        switch (true) {
            case this.level < 10:
                this.maxXp = Math.floor(this.maxXp * 1.5);
                break;
            case this.level < 20:
                this.maxXp = Math.floor(this.maxXp * 1.3);
                break;
            case this.level < 30:
                this.maxXp = Math.floor(this.maxXp * 1.2);
                break;
            case this.level < 40:
                this.maxXp = Math.floor(this.maxXp * 1.1);
                break;
            case this.level < 50:
                this.maxXp = Math.floor(this.maxXp * 1.05);
                break;
            case this.level === 50:
                this.levelMaxReached = true;
                break;
        }
    }

    update() {
        this.checkPlayer();
        this.handleMovement();
    }
}


import GameScene from "../game/scenes/GameScene";

export class Being extends Phaser.Physics.Arcade.Sprite {
    id: string;
    spriteKey: string;
    declare name: string;
    scene: GameScene; // Redéfinir le type de scene

    public constructor(
        scene: GameScene,
        id: string,
        x: number,
        y: number,
        name: string,
        spriteKey: string
    ) {
        super(scene, x, y, spriteKey);
        this.scene = scene; // maintenant tu peux accéder à map, etc.
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.id = id;
        this.name = name;
        this.spriteKey = spriteKey;
    }
}


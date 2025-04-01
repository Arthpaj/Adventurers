import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }

    create() {
        console.log("GameScene: create");

        // Démarrer directement la scène Map (elle doit être enregistrée dans PhaserGame.tsx)
        this.scene.start("Map");
    }
}


import { useEffect } from "react";
import Phaser from "phaser";
import Map from "./scenes/GameScene";
import StartScene from "./scenes/StartScene";

const PhaserGame = () => {
    useEffect(() => {
        // Initialiser le jeu Phaser
        const config = {
            type: Phaser.AUTO,
            width: innerWidth,
            height: innerHeight,
            scene: [StartScene, Map],
            parent: "phaser-container",
            physics: {
                default: "arcade",
                arcade: {
                    gravity: { x: 0, y: 0 },
                    debug: true,
                },
            },
        };

        const game = new Phaser.Game(config);

        const handleResize = () => {
            game.scale.resize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener("resize", handleResize);
        // Nettoyer le jeu quand le composant est démonté
        return () => {
            window.removeEventListener("resize", handleResize);
            game.destroy(true);
        };
    }, []);

    return <div id="phaser-container"></div>;
};

export default PhaserGame;


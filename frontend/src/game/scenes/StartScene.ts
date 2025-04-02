import { CoreScene } from "../../core/coreScene";

export default class StartScene extends CoreScene {
    constructor() {
        super({ key: "StartScene" });
    }

    create() {
        // Add welcome text and center it based on screen size
        this.add
            .text(
                this.cameras.main.centerX,
                this.cameras.main.centerY - 100,
                "Welcome to the Game!",
                {
                    fontSize: "32px",
                    color: "#ffffff", // Text color
                }
            )
            .setOrigin(0.5); // Centers the text both horizontally and vertically

        // Add the "Start Game" button and center it
        const button = this.add
            .text(
                this.cameras.main.centerX,
                this.cameras.main.centerY + 50,
                "Start Game",
                {
                    fontSize: "24px",
                    color: "#00ff00", // Text color
                    backgroundColor: "#000000", // Background color
                }
            )
            .setOrigin(0.5); // Centers the button horizontally and vertically

        // Make the button interactive
        button.setInteractive();

        // When the button is clicked, transition to the map scene
        button.on("pointerdown", () => {
            this.scene.start("GameScene"); // Replace 'GameScene' with the name of your map scene
        });

        // Hover effect: change color when the button is hovered
        button.on("pointerover", () => {
            button.setStyle({ color: "#ff0000" }); // Change color when hovered
        });

        button.on("pointerout", () => {
            button.setStyle({ color: "#00ff00" }); // Reset color when not hovered
        });
    }

    handleResize() {
        this.resizeViewPort(this.scale.width, this.scale.height);
    }
}


import { CoreScene } from "../../core/coreScene";

export default class StartScene extends CoreScene {
    constructor() {
        super({ key: "StartScene" });
    }

    preload() {
        this.load.image("background", "assets/background_main_menu.jpg"); // Remplace avec ton chemin d'image
    }

    create() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        const bg = this.add.image(0, 0, "background").setOrigin(0);
        bg.setDisplaySize(this.scale.width, this.scale.height);

        // Welcome text
        this.add
            .text(centerX, centerY - 100, "Welcome to the Game!", {
                fontSize: "32px",
                color: "#ffffff",
            })
            .setOrigin(0.5);

        // Create the button text
        const buttonText = this.add.text(0, 0, "Start Game", {
            fontSize: "24px",
            color: "#ffffff",
        });

        buttonText.setOrigin(0.5);

        // Calculate background dimensions
        const padding = 20;
        const buttonWidth = buttonText.width + padding * 2;
        const buttonHeight = buttonText.height + padding;

        const borderColor = 0xd3d3d3;
        const borderThickness = 2;

        // Create background graphics for the button
        const buttonBg = this.add.graphics();
        buttonBg.lineStyle(borderThickness, borderColor, 1);
        buttonBg.fillStyle(0xcf9a3e, 1);
        buttonBg.strokeRoundedRect(
            -buttonWidth / 2,
            -buttonHeight / 2,
            buttonWidth,
            buttonHeight,
            10
        );
        buttonBg.fillRoundedRect(
            -buttonWidth / 2,
            -buttonHeight / 2,
            buttonWidth,
            buttonHeight,
            10
        );

        // Combine text and background into a container
        const button = this.add.container(centerX, centerY + 50, [
            buttonBg,
            buttonText,
        ]);

        button.setSize(buttonWidth, buttonHeight);
        button.setInteractive({ useHandCursor: true });

        // Click to start game
        button.on("pointerdown", () => {
            this.scene.start("GameScene");
        });

        // Hover effects
        button.on("pointerover", () => {
            buttonBg.clear();
            buttonBg.lineStyle(borderThickness, borderColor, 1); // Restore border
            buttonBg.fillStyle(0xb8822c, 1); // Darker background
            buttonBg.strokeRoundedRect(
                -buttonWidth / 2,
                -buttonHeight / 2,
                buttonWidth,
                buttonHeight,
                10
            );
            buttonBg.fillRoundedRect(
                -buttonWidth / 2,
                -buttonHeight / 2,
                buttonWidth,
                buttonHeight,
                10
            );
            buttonText.setColor("#ffffff");
        });

        button.on("pointerout", () => {
            buttonBg.clear();
            buttonBg.lineStyle(borderThickness, borderColor, 1); // Restore border
            buttonBg.fillStyle(0xcf9a3e, 1); // Original background
            buttonBg.strokeRoundedRect(
                -buttonWidth / 2,
                -buttonHeight / 2,
                buttonWidth,
                buttonHeight,
                10
            );
            buttonBg.fillRoundedRect(
                -buttonWidth / 2,
                -buttonHeight / 2,
                buttonWidth,
                buttonHeight,
                10
            );
            buttonText.setColor("#ffffff");
        });
    }

    handleResize() {
        this.resizeViewPort(this.scale.width, this.scale.height);
    }
}


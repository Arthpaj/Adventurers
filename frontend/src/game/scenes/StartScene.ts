import { CoreScene } from "../../core/coreScene";

export default class StartScene extends CoreScene {
    private bg!: Phaser.GameObjects.Image; // Déclarer bg pour la réutiliser plus tard
    private startButton!: Phaser.GameObjects.Container;

    constructor() {
        super({ key: "StartScene" });
    }

    preload() {
        this.load.image("background", "assets/background_main_menu.jpg");
    }

    create() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // Créez l'image de fond
        this.bg = this.add.image(0, 0, "background").setOrigin(0);
        this.bg.setDisplaySize(this.scale.width, this.scale.height); // Redimensionner l'image de fond

        // Texte de bienvenue
        this.add
            .text(centerX, centerY - 100, "Welcome to the Game!", {
                fontSize: "32px",
                color: "#ffffff",
            })
            .setOrigin(0.5);

        // Créez le bouton
        this.startButton = this.createButton(
            centerX,
            centerY,
            "Start Game",
            "#cf9a3e",
            () => {
                this.scene.start("GameScene");
            }
        );

        // Ajuster la taille des éléments au début
        //this.resizeElements();

        // Écouter l'événement de redimensionnement de la fenêtre
        this.scale.on("resize", this.handleResize.bind(this));
    }

    handleResize() {
        // Appeler resizeViewPort pour ajuster la scène
        this.resizeViewPort(this.scale.width, this.scale.height);

        // Mettre à jour la taille et la position des éléments
        //this.resizeElements();
    }
}


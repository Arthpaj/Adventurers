import Character from "../Controllable/Character";
import Map from "../../object/map"; // Import the Map class
import { CoreScene } from "../../core/coreScene";

class GameScene extends CoreScene {
    private player!: Character;
    private map!: Map;
    private popUp!: Phaser.GameObjects.Container;
    private isPopUpVisible: boolean = false; // Suivi de l'état du pop-up
    private mapLayer!: Phaser.Tilemaps.TilemapLayer | null;

    constructor() {
        super({ key: "GameScene" });
    }

    preload() {
        // Charge la carte et les assets
        this.load.tilemapTiledJSON("map", "assets/desert.json");
        this.load.image("desert_biome", "assets/desert_biome.png");
        this.load.spritesheet("player", "assets/character/knight_bronze.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
    }

    create() {
        // Charge la carte et le tileset
        const map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage("desert_biome", "desert_biome");

        if (!tileset) {
            console.error("Le tileset n'a pas pu être chargé");
            return;
        }

        // Crée les calques
        this.mapLayer = map.createLayer("Ground", tileset, 0, 0);

        // Crée l'objet Map
        this.map = new Map(map);

        // 📏 Mettre à jour les limites de la caméra pour correspondre à la taille réelle de la carte
        this.cameras.main.setBounds(
            0,
            0,
            map.widthInPixels, // Largeur réelle de la carte
            map.heightInPixels // Hauteur réelle de la carte
        );

        // Crée le joueur
        this.player = new Character(this, 752, 1576, "player");

        // ✅ Assure que la caméra suit le joueur
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setLerp(1, 1); // Réactivité immédiate

        // Redimensionne le viewport en fonction de la taille de l'écran
        this.scale.on("resize", this.handleResize.bind(this));
        this.resizeViewPort(
            this.map.getMapDisplayWidth(),
            this.map.getMapDisplayHeight()
        );

        // Créer le pop-up de quitter
        this.createQuitPopUp();
        // Gérer l'appui sur la touche Échap
        if (this.input.keyboard) {
            this.input.keyboard.on("keydown-ESC", () => this.showQuitPopUp());
        }
    }

    createQuitPopUp() {
        console.log("Pop-up affiché !");

        // Crée un conteneur pour le pop-up
        this.popUp = this.add.container(
            this.scale.width / 2,
            this.scale.height / 2
        );
        this.popUp.setSize(300, 200);
        this.popUp.setVisible(false); // 🌟 Visible dès le début
        this.popUp.setScrollFactor(0);

        // 🔲 Création du fond du pop-up
        const background = this.add.graphics();
        background.fillStyle(0x000000, 0.8); // Fond noir semi-transparent
        background.fillRoundedRect(-150, -100, 300, 200, 10); // Fond arrondi

        // 🔴 Ajout d'un contour rouge
        background.lineStyle(4, 0xff0000, 1);
        background.strokeRoundedRect(-150, -100, 300, 200, 10);

        background.setDepth(-1); // Met le fond derrière tout

        // 📝 Texte principal du pop-up
        const popupText = this.add
            .text(0, -50, "Voulez-vous quitter ?", {
                font: "24px Arial",
                color: "#FFFFFF",
            })
            .setOrigin(0.5);

        // 🔘 Création des boutons
        const buttonQuit = this.createButton(0, 30, "Quitter", "#ff0000", () =>
            this.quitGame()
        );
        this.popUp.setInteractive(); // Nécessaire pour que le container route les events
        this.popUp.disableInteractive();
        // Ajouter tous les éléments au conteneur
        this.popUp.add([background, popupText, buttonQuit]);

        buttonQuit.on("pointerover", () => {
            console.log("Souris survole le pop-up");
        });

        buttonQuit.on("pointerdown", () => {
            console.log("Button clicked!");
        });

        console.log(this.isContainerInteractive(this.popUp)); // Affiche true si le conteneur popUp est interactif, sinon false
        console.log(this.isContainerInteractive(buttonQuit));
    }

    showQuitPopUp() {
        // Basculer l'état de visibilité du pop-up
        if (this.isPopUpVisible) {
            this.popUp.setVisible(false); // Masquer le pop-up// Rétablir l'opacité de la scène
            if (this.mapLayer) {
                this.mapLayer.setAlpha(1); // Rétablir l'alpha du calque de la carte
            }
            this.isPopUpVisible = false;
        } else {
            this.popUp.setVisible(true); // Afficher le pop-up
            if (this.mapLayer) {
                this.mapLayer.setAlpha(0.3); // Appliquer l'alpha réduit sur la carte
            }
            this.isPopUpVisible = true;
        }
    }

    isContainerInteractive(container: Phaser.GameObjects.Container): boolean {
        // Vérifier si la propriété 'input' est définie
        return container.input != null;
    }

    quitGame() {
        // Quitter la scène et aller à StartScene
        this.scene.start("StartScene");
    }

    handleResize() {
        this.resizeViewPort(
            this.map.getMapDisplayWidth(),
            this.map.getMapDisplayHeight()
        );
        //this.centerCamera();
    }

    // centerCamera() {
    //     if (this.player) {
    //         this.cameras.main.startFollow(this.player, true);
    //     } else {
    //         this.cameras.main.centerOn(
    //             this.map.getMapDisplayWidth() / 2,
    //             this.map.getMapDisplayHeight() / 2
    //         );
    //     }
    // }

    update() {
        this.player.update();
    }

    getMap(): Map {
        return this.map;
    }
}

export default GameScene;


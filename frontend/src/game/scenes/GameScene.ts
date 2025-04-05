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
        this.popUp = this.createContainer({
            title: "Voulez-vous quitter ?",
            bgColor: 0x000000,
            borderColor: 0xff0000,
            x: -150,
            y: -100,
            width: 300,
            height: 200,
        });

        this.popUp.setVisible(false);
        this.popUp.setInteractive();
        this.popUp.disableInteractive();
        this.popUp.setScrollFactor(0);

        const buttonQuit = this.createButton({
            x: 0,
            y: 30,
            text: "Quitter",
            color: "#ff0000",
            onClick: () => this.quitGame(),
        });

        this.popUp.add(buttonQuit);
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


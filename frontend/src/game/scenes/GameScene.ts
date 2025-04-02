import Character from "../Controllable/Character";
import Map from "../../object/map"; // Import the Map class
import { CoreScene } from "../../core/coreScene";

class GameScene extends CoreScene {
    private player!: Character;
    private map!: Map;

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
        const layers = ["Ground-1", "Ground", "Ground1", "Ground2"];
        layers.forEach((layerName) => {
            const layer = map.createLayer(layerName, tileset, 0, 0);
            if (!layer) {
                console.error(`Le calque '${layerName}' est introuvable.`);
            }
        });

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
    }

    handleResize() {
        this.resizeViewPort(
            this.map.getMapDisplayWidth(),
            this.map.getMapDisplayHeight()
        );
        this.centerCamera();
    }

    centerCamera() {
        if (this.player) {
            this.cameras.main.startFollow(this.player, true);
        } else {
            this.cameras.main.centerOn(
                this.map.getMapDisplayWidth() / 2,
                this.map.getMapDisplayHeight() / 2
            );
        }
    }

    update() {
        this.player.update();
    }

    getMap(): Map {
        return this.map;
    }
}

export default GameScene;


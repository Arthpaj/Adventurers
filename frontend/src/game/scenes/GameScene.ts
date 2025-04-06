import Character from "../Controllable/Character";
import Map from "../../object/map"; // Import the Map class
import { CoreScene } from "../../core/coreScene";
import io from "socket.io-client"; // Import the correct socket type

interface MovementData {
    x: number;
    y: number;
    id: string;
}

class GameScene extends CoreScene {
    private player!: Character;
    private map!: Map;
    private popUp!: Phaser.GameObjects.Container;
    private isPopUpVisible: boolean = false; // Suivi de l'état du pop-up
    private mapLayer!: Phaser.Tilemaps.TilemapLayer | null;
    private socket!: ReturnType<typeof io>; // Declare socket as the Socket type
    private otherPlayers: { id: string; sprite: Phaser.GameObjects.Sprite }[] =
        [];

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
        // Initialize WebSocket connection
        this.socket = io("http://localhost:3002");

        // Listen for other players' movements
        this.socket.on("playerMove", (data: MovementData) => {
            if (data.id !== this.socket.id) {
                console.log(
                    `Player ${data.id} moved to (${data.x}, ${data.y})`
                );
                this.updateOtherPlayerPosition(data);
            }
        });

        // Handle player movement
        this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
            const playerData = { x: pointer.x, y: pointer.y };
            this.socket.emit("playerMoved", playerData); // Emit movement to the server
        });

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
            map.widthInPixels,
            map.heightInPixels
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
    }

    updateOtherPlayerPosition(data: MovementData) {
        // Check if the other player is already added to the game
        const existingPlayer = this.otherPlayers.find(
            (player) => player.id === data.id
        );

        if (!existingPlayer) {
            // If the player doesn't exist, create a new player sprite
            const newPlayer = this.add.sprite(data.x, data.y, "player");
            this.otherPlayers.push({ id: data.id, sprite: newPlayer });
        } else {
            // Update the existing player's position
            existingPlayer.sprite.setPosition(data.x, data.y);
        }
    }

    update() {
        this.player.update();

        // If the player's position has changed, emit the movement data
        if (this.player.hasMoved) {
            const playerData = { x: this.player.x, y: this.player.y };
            this.socket.emit("playerMoved", playerData);
            this.player.hasMoved = false; // Reset the movement flag
        }
    }

    getMap(): Map {
        return this.map;
    }
}

export default GameScene;


import Phaser from "phaser";
import Character from "../Controllable/Character";
import { Tile } from "../../object/tile";

class Map extends Phaser.Scene {
    private player!: Character;
    private tiles: Tile[] = [];

    constructor() {
        super({ key: "GameScene" });
    }

    private mapDisplayWidth: number;
    private mapDisplayHeight: number;

    preload() {
        // Charge la carte JSON
        this.load.tilemapTiledJSON("map", "assets/desert.json");

        // Charge le tileset associé
        this.load.image("desert_biome", "assets/desert_biome.png");

        //perso
        this.load.spritesheet("player", "assets/character/knight_bronze.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
    }

    create() {
        // Récupère la carte chargée
        const map = this.make.tilemap({ key: "map" });

        // Ajoute le tileset à la carte
        const tileset = map.addTilesetImage("desert_biome", "desert_biome");

        if (!tileset) {
            console.error("Le tileset n'a pas pu être chargé");
            return;
        }

        // Création des calques
        const layers = ["Ground-1", "Ground", "Ground1", "Ground2"];
        layers.forEach((layerName) => {
            const layer = map.createLayer(layerName, tileset, 0, 0);
            if (!layer) {
                console.error(`Le calque '${layerName}' est introuvable.`);
            }
        });

        // 📏 **Taille voulue en tuiles**
        const tilesToShowX = 40; // Nombre de tuiles en largeur
        const tilesToShowY = 20; // Nombre de tuiles en hauteur

        // 📐 **Taille d'une tuile (en pixels)**
        const tileWidth = map.tileWidth;
        const tileHeight = map.tileHeight;

        // Générer les tuiles avec la classe Tile
        this.createTiles(map, tileWidth, tileHeight);

        // 📏 **Taille totale des tuiles visibles**
        this.mapDisplayWidth = tilesToShowX * tileWidth;
        this.mapDisplayHeight = tilesToShowY * tileHeight;

        //this.cameras.main.setBounds(0, 0, mapPixelWidth, mapPixelHeight);

        this.scale.on("resize", this.handleResize.bind(this));
        this.resizeViewPort();

        this.player = new Character(this, 200, 150, "player");

        // 📝 Dessiner la grille de débogage
        this.drawDebugGrid(map);
    }

    handleResize() {
        this.resizeViewPort();
    }

    createTiles(
        map: Phaser.Tilemaps.Tilemap,
        tileWidth: number,
        tileHeight: number
    ) {
        const layers = map.layers;

        layers.forEach((layer) => {
            for (let y = 0; y < map.height; y++) {
                for (let x = 0; x < map.width; x++) {
                    const tile = layer.data[y][x]; // Récupère la tuile à la position (x, y)
                    if (tile) {
                        const blocking = this.isBlockingTile(tile.index); // Vérifie si la tuile est bloquante
                        const tileObj = new Tile(
                            tile.index,
                            x * tileWidth,
                            y * tileHeight,
                            blocking
                        );
                        this.tiles.push(tileObj); // Ajoute la tuile dans le tableau
                    }
                }
            }
        });
    }

    isBlockingTile(id: number): boolean {
        // Exemple : on considère les tuiles avec l'ID 2 comme bloquantes
        return [
            8, 17, 26, 35, 34, 33, 41, 42, 43, 44, 50, 51, 52, 53, 54, 55, 56,
            57, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 72, 73, 74, 75,
            76, 77, 78, 79, 80,
        ].includes(id); // Tu peux étendre cette logique avec les IDs qui doivent être bloquants
    }

    resizeViewPort() {
        const screenWidth = this.scale.width;
        const screenHeight = this.scale.height;

        const zoomX = screenWidth / this.mapDisplayWidth;
        const zoomY = screenHeight / this.mapDisplayHeight;
        const zoom = Math.min(zoomX, zoomY); // Assure qu'on ne dépasse pas l'écran

        const newWidth = this.mapDisplayWidth * zoom;
        const newHeight = this.mapDisplayHeight * zoom;

        if (newWidth !== this.scale.width || newHeight !== this.scale.height) {
            this.scale.resize(
                this.mapDisplayWidth * zoom,
                this.mapDisplayHeight * zoom
            );
            this.cameras.main.setZoom(zoom);
        }

        this.centerCamera();
    }

    centerCamera() {
        const centerX = Math.min(
            this.mapDisplayWidth / 2,
            this.mapDisplayWidth / 2
        );
        const centerY = Math.min(
            this.mapDisplayHeight / 2,
            this.mapDisplayHeight / 2
        );

        this.cameras.main.centerOn(centerX, centerY);
    }

    // ✅ Fonction pour dessiner la grille de débogage
    drawDebugGrid(map: Phaser.Tilemaps.Tilemap) {
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0xff0000, 0.5); // Rouge, 50% de transparence

        const tileSize = map.tileWidth;
        const mapWidth = map.widthInPixels;
        const mapHeight = map.heightInPixels;

        // 🔹 Dessiner les lignes verticales
        for (let x = 0; x <= mapWidth; x += tileSize) {
            graphics.moveTo(x, 0);
            graphics.lineTo(x, mapHeight);
        }

        // 🔹 Dessiner les lignes horizontales
        for (let y = 0; y <= mapHeight; y += tileSize) {
            graphics.moveTo(0, y);
            graphics.lineTo(mapWidth, y);
        }

        graphics.strokePath();
    }

    // ✅ Fonction pour obtenir la tuile à une position donnée
    getTileAt(x: number, y: number): Tile | undefined {
        return this.tiles.find((tile) => tile.x === x && tile.y === y);
    }

    update() {
        this.player.update();
    }
}

export default Map;


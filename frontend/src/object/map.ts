import { Tile } from "./tile";

class Map {
    private tileSize = 32;
    private tiles: Tile[] = [];
    private mapDisplayWidth: number;
    private mapDisplayHeight: number;

    constructor(private map: Phaser.Tilemaps.Tilemap) {
        // Initialize map dimensions based on tileset and size
        const tilesToShowX = 40; // Number of tiles horizontally
        const tilesToShowY = 20; // Number of tiles vertically
        const tileWidth = map.tileWidth;
        const tileHeight = map.tileHeight;

        this.mapDisplayWidth = tilesToShowX * tileWidth;
        this.mapDisplayHeight = tilesToShowY * tileHeight;

        this.createTiles(map, tileWidth, tileHeight);
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
                    const tile = layer.data[y][x]; // Get tile at position (x, y)
                    if (tile) {
                        const blocking = this.isBlockingTile(tile.index); // Check if the tile is blocking
                        const tileObj = new Tile(
                            tile.index,
                            x * tileWidth,
                            y * tileHeight,
                            blocking
                        );
                        this.tiles.push(tileObj); // Add the tile to the tiles array
                    }
                }
            }
        });
    }

    isBlockingTile(id: number): boolean {
        return [
            8, 17, 26, 35, 34, 33, 41, 42, 43, 44, 50, 51, 52, 53, 54, 55, 56,
            57, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 72, 73, 74, 75,
            76, 77, 78, 79, 80,
        ].includes(id - 1); // Adjust the logic as needed
    }

    getTileAt(x: number, y: number): Tile {
        const tileX = Math.floor(x / this.tileSize);
        const tileY = Math.floor(y / this.tileSize);
        return (
            this.tiles.find(
                (tile) =>
                    tile.x === tileX * this.tileSize &&
                    tile.y === tileY * this.tileSize
            ) ||
            new Tile(-1, tileX * this.tileSize, tileY * this.tileSize, true)
        );
    }

    getMapDisplayWidth(): number {
        return this.mapDisplayWidth;
    }

    getMapDisplayHeight(): number {
        return this.mapDisplayHeight;
    }
}

export default Map;


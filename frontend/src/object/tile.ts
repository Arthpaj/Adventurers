export class Tile {
    id: number;
    x: number;
    y: number;
    blocking: boolean;

    constructor(id: number, x: number, y: number, blocking: boolean) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.blocking = blocking;
    }
}


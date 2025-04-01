export abstract class CollectibleResource<CollectibleTypes extends string> {
    type: CollectibleTypes;
    isEmpty: boolean;
    tilesMap: Map<string, number>;

    constructor(type: CollectibleTypes, tilesMap: Map<string, number>) {
        this.type = type;
        this.tilesMap = tilesMap;
        this.isEmpty = false;
    }

    collect(): void {
        this.isEmpty = true;
    }

    render(): number | undefined {
        if (this.isEmpty) {
            return this.tilesMap.get(`${this.type}Empty`);
        }

        return this.tilesMap.get(this.type);
    }
}


import { CollectibleResource } from "../../core/collectible";

const OreTile: Map<string, number> = new Map([
    ["Iron", 77],
    ["IronEmpty", 59],
    ["Gold", 68],
    ["GoldEmpty", 59],
]);

enum OreType {
    Iron = "Iron",
    Gold = "Gold",
}

export class Ore extends CollectibleResource<OreType> {
    constructor(type: OreType) {
        super(type, OreTile);
    }
}


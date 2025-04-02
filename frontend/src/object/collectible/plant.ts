import { CollectibleResource } from "../../core/collectible";

const PlantTile: Map<string, number> = new Map([
    ["Yucca", 77],
    ["YuccaEmpty", 59],
    ["AloeVera", 68],
    ["AloeVeraEmpty", 59],
]);
enum PlantType {
    Yucca = "Yucca",
    AloeVera = "AloeVera",
}
export class Plant extends CollectibleResource<PlantType> {
    constructor(type: PlantType) {
        super(type, PlantTile);
    }
}


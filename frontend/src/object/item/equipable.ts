import { Craft } from "../craft";
import { Item } from "./item";

export enum EquipableType {
    Head = "Head",
    Chest = "Chest",
    Feet = "Feet",
    cape = "cape",
    amulet = "amulet",
    mainHand = "mainHand",
    offHand = "offHand",
}
export class Equipable<
    type extends EquipableType = EquipableType
> extends Item {
    type: type;
    bonuses: [string, number][];
    levelNeeded: number;
    craft: Craft | undefined;
    rarity: number;
    isEquipped: boolean;
    inGameSprite: string;
}


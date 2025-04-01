import { Item } from "./item/item";

export class Craft {
    name: string;
    description: string;
    sprite: string;
    ingredients: { item: Item; amount: number }[];
    levelNeeded: number;
    xpGiven: number;
    constructor(
        name: string,
        description: string,
        sprite: string,
        ingredients: { item: Item; amount: number }[],
        levelNeeded: number,
        xpGiven: number
    ) {
        this.name = name;
        this.description = description;
        this.sprite = sprite;
        this.ingredients = ingredients;
        this.levelNeeded = levelNeeded;
        this.xpGiven = xpGiven;
    }
}


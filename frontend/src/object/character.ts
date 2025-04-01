import { Inventory } from "./inventory";
import { Job } from "./job";

export class Character {
    id: string;
    playerId: string;
    name: string;
    sprite: string;
    x: number;
    y: number;
    health: number;
    maxHealth: number;
    level: number;
    xp: number;
    maxXp: number;
    jobs: Job[];
    inventory: Inventory;
    currentLayer: number;
}


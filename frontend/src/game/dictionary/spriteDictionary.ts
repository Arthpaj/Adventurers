export const spriteDictionary: Record<
    string,
    { path: string; frameWidth: number; frameHeight: number }
> = {
    wizzard_blue: {
        path: "assets/character/wizzard_blue.png",
        frameWidth: 64,
        frameHeight: 64,
    },
    wizzard_purple: {
        path: "assets/character/wizzard_purple.png",
        frameWidth: 64,
        frameHeight: 64,
    },
    knight_gray: {
        path: "assets/character/knight_gray.png",
        frameWidth: 64,
        frameHeight: 64,
    },
    knight_gold: {
        path: "assets/character/knight_gold.png",
        frameWidth: 64,
        frameHeight: 64,
    },
    knight_bronze: {
        path: "assets/character/knight_bronze.png",
        frameWidth: 64,
        frameHeight: 64,
    },
    knight_pink: {
        path: "assets/character/knight_pink.png",
        frameWidth: 64,
        frameHeight: 64,
    },
    maitre_pingou: {
        path: "assets/character/maitre_pingou.png",
        frameWidth: 96,
        frameHeight: 96,
    },
};
export function getSpriteData(key: string) {
    return spriteDictionary[key];
}


import { Character } from "./character";

export class Player {
    id: string;
    name: string;
    password: string;
    characters: Character[];
    currentCharacter: Character | null;
}


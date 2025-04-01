export class Item {
    id: string;
    name: string;
    description: string;
    sprite: string;
    constructor(name: string, sprite: string, description: string, id: string) {
        this.id = id;
        this.name = name;
        this.sprite = sprite;
        this.description = description;
    }
}


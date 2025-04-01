import { Item } from "./item/item";

export class Inventory {
    items: [Item, number][];
    constructor(items: [Item, number][]) {
        this.items = items;
    }

    addItem(item: Item, amount: number) {
        let found = false;
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i][0].id === item.id) {
                this.items[i][1] += amount;
                found = true;
                break;
            }
        }
        if (!found) {
            this.items.push([item, amount]);
        }
    }

    removeItem(item: Item) {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i][0].id === item.id) {
                this.items[i][1]--;
                if (this.items[i][1] === 0) {
                    this.items.splice(i, 1);
                }
                break;
            }
        }
    }
}


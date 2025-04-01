import { Equipable } from "./equipable";
import { EquipableType } from "./equipable";
import { Spell } from "../spell";

type WeaponEquipableType = Extract<
    EquipableType,
    EquipableType.mainHand | EquipableType.offHand
>;

export class Weapon extends Equipable<WeaponEquipableType> {
    damageType: string;
    damage: number;
    isTwoHanded: boolean;
    range: number;
    Spells: Spell[] | undefined;
}


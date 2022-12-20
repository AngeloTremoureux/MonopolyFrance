import { Player } from "../player/player";
import { CardPrizeType, CardType } from "../types/types";
import { Utils } from "../utils/utils";

export class Card {

    private position: number;
    private nom: string;
    private type: CardType;

    public level: number|null;
    public prize: CardPrizeType|null;
    public ownerId: number|null;
    public owner: Player|null;
    public color: number;

    public constructor(position: number, nom: string, type: CardType, prize: CardPrizeType, color: number) {
        this.position = position;
        this.nom = nom;
        this.type = type;
        this.prize = prize;
        this.color = color;
        this.level = null;
        this.ownerId = null;
        this.owner = null;
    }

    public isOwned(): boolean {
        return Utils.isset(this.ownerId);
    }

    public getPosition(): number {
        return this.position;
    }

    public getNom(): string {
        return this.nom;
    }

    public getType(): CardType {
        return this.type;
    }

    public isVille(): boolean {
        return this.type.id === 1;
    }

    public isMonument(): boolean {
        return this.type.id === 2;
    }

    public isChance(): boolean {
        return this.type.id === 7;
    }

    public isTaxe(): boolean {
        return this.type.id === 8;
    }

    public resetOwnerCard(): void {
        this.level = null;
        this.prize = null;
        this.ownerId = null;
    }

}

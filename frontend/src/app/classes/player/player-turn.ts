import { Game } from "../game/game";
import { Player } from "./player";

export class PlayerTurn {

    private game: Game;
    private playerTurn: number;

    public constructor(game: Game, playerTurn: number) {
        this.game = game;
        this.playerTurn = playerTurn;
    }

    public getNumberTurn(): number {
        return this.playerTurn;
    }

    public getPlayerTurn(): Player {
        return this.game.parameters.players[this.playerTurn - 1];
    }

    public setPlayerTurn(playerIndex: number) {
        this.playerTurn = playerIndex;
        this.game.checkPlayerTurn();
    }

    /**
     * Vérifie si c'est au tour du joueur actuel
     * @returns boolean Vrai/Faux
     */
    public isMyTurn(): boolean {
        return this.getPlayerTurn().id === this.game.parameters.playerId;
    }

    private isAllEliminated(): boolean {
        let count = 0;
        this.game.parameters.players.forEach(player => {
            if (player.isEliminated) {
                count++;
            }
        });
        return (count >= this.game.parameters.players.length);
    }

    public setNextPlayerTurn(): void {
        if (this.isAllEliminated()) {
            return;
        }
        let tempTurn = (this.playerTurn + 1 > this.game.parameters.players.length) ? 1 : this.playerTurn + 1;
        while (this.game.parameters.players[tempTurn - 1].isEliminated) {
            tempTurn++;
            if (tempTurn > this.game.parameters.players.length) {
                tempTurn = 1;
            }
        }
        this.playerTurn = tempTurn;
        if (this.isMyTurn()) {
            this.game.checkPlayerTurn();
        }
    }

}

import { Card } from "../card/card"
import { Player } from "../player/player"
import { PlayerTurn } from "../player/player-turn"

export type GameParameterType = {
    gameId: number,
    playerId: number,
    playerTurn: PlayerTurn,
    nbPlayers: number,
    state: number,
    timer: number,
    players: Player[],
    cards: Card[]
}


export type CardType = {
    id: number,
    nom: string
}

export type CardPrizeType = {
    purchasePrize: number[],
    taxAmount: number[],
}

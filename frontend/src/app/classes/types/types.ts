import { Card } from "../card/card"
import { Player } from "../player/player"

export type GameParameters = {
  game: GameType,
  player: {
    list: Player[],
    boardOwner: Player
    current: Player
  }
  cards: Card[]
}

export type GameType = {
  id: number,
  code: string,
  isOver: boolean,
  isStarted: true,
  timer: number,
  playerTurn: Player
  nbPlayers: number
  state: GameStateType
}

export type CardPrizeType = {
  purchasePrize: CardPriseAmountType[],
  taxAmount: CardPriseAmountType[]
}

export type GameStateType = {
  list: GameStateDataType[]
  current: GameStateDataType
}

export type GameStateDataType = {
  id: number,
  message: string
}

export type CardPriseAmountType = {
  id: number,
  cost: number,
  settings: CardSettingsType,
}

export type CardType = {
  id: number,
  nom: string
}

export type CardSettingsType = {
  id: number,
  nom: string,
  color: number | null,
  type: CardType
}

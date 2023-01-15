import { Card } from "../card/card"

export type GameParameters = {
  game: GameType,
  board: {
    list: BoardType[],
    boardOwner: BoardType
    myBoard: BoardType
  }
  card: Card
}

export type BoardType = {
  id: string,
  isReady: boolean,
  avatar: number,
  money: number,
  GameId: number,
  PlayerId: number,
  Game: GameType,
  Player: PlayerType
}

export type GameType = {
  id: number,
  code: string,
  isOver: boolean,
  isStarted: true,
}

export type CardPrizeType = {
  purchasePrize: CardPriseAmountType[],
  taxAmount: CardPriseAmountType[]
}

export type CardPriseAmountType = {
  id: number,
  cost: number,
  settings: CardSettingsType,
}

export type PlayerType = {
  id: number,
  username: string
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

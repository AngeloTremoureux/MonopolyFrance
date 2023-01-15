export type BoardType = {
  id: string,
  isReady: boolean,
  avatar: number,
  money: number,
  GameId: number,
  PlayerId: number,
  createdAt: string,
  updatedAt: string,
  Game: GameType,
  Player: PlayerType
}

export type GameType = {
  id: number,
  code: string,
  isOver: boolean,
  isStarted: true,
  createdAt: string,
  updatedAt: string
}

export type PlayerType = {
  id: number,
  username: string
}

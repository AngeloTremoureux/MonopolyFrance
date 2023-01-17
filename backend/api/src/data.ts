import Board from './../models/board';
import CardPurchasePrize from './../models/card-purchase-prize';
import CardSettings from './../models/card-settings';
import CardTaxAmount from './../models/card-tax-amount';
import CardType from './../models/card-type';
import Card from './../models/card';
import Chance from './../models/chance';
import GameState from './../models/game_state';
import GameSettings from './../models/game-settings';
import Game from './../models/game';
import Player from './../models/player';
import Position from './../models/position';

import { Sequelize, sequelize, seq } from './../models';

import CryptoJS from 'crypto-js';
import crypto from 'crypto';
import token from './../../tokens/tokens.json';
import jwt from 'jsonwebtoken';
import { exit } from 'process';


export async function findGameByCode(code: string): Promise<any> {
  if (!code) exit();
  const game = await Game.findOne({
    where: {
      code: code
    },
    include: [
      {
        model: GameSettings
      }, {
        model: Card,
        include: [{
          model: CardSettings,
          include: [{
            model: CardType
          }]

        }]
      }, {
        model: Board,
        include: [{
          model: Position,
          attributes: ['numero']
        }, {
          model: Player
        }]
      }
    ]
  });
  return game;
}

export async function addPlayerToGame(userId: number, code: string): Promise<SuccessOutput | ErrorOutput> {
  if (!userId || !code) throw "Erreur interne au serveur";
  try {
    const currentBoard = await findBoardByPlayerId(userId);
    if (currentBoard) throw "Une game est déjà en cours";
    const game = await findGameByCode(code);
    if (!game || !game.Boards || game.Boards.length >= 4) throw "Une erreur est survenue";

    const board: Board = await Board.create({ avatar: 1, isReady: false, GameId: game.id, PlayerId: userId });
    if (!board) throw "Une erreur est survenue";
    return new SuccessOutput({ board });
  } catch (error) {
    return handleError(error);
  }
}
export async function startGame(playerId: number): Promise<SuccessOutput | ErrorOutput> {
  try {
    if (!playerId) throw "Erreur interne au serveur";
    const isOwner = await isOwnerOfGame(playerId);
    if (isOwner instanceof ErrorOutput || !isOwner.data.isOwner) throw "Le joueur n'est pas le chef de la partie";
    const board = await findBoardByPlayerId(playerId);
    if (!board) throw "Le joueur n'a pas de partie";
    if (board.Game.isStarted) throw "La partie est déjà en cours";
    board.Game.isStarted = true;
    board.Game.save();
    return new SuccessOutput({ board });
  } catch (error) {
    return handleError(error);
  }
}

export async function kickPlayerFromGame(fromPlayerId: number, toPlayerId: number): Promise<SuccessOutput | ErrorOutput> {
  try {
    if (!fromPlayerId || !toPlayerId) throw "Erreur interne au serveur";
    const isOwner = await isOwnerOfGame(fromPlayerId);
    if (isOwner instanceof ErrorOutput || !isOwner.data.isOwner) throw "Le joueur n'est pas le chef de la partie";
    const board = await findBoardByPlayerId(toPlayerId);
    if (!board) throw "Le joueur n'a pas de partie";
    if (board.GameId !== isOwner.data.board.GameId) throw "Les joueurs ne sont pas dans la même partie";
    const oldBoard = board;
    await board.destroy();
    return new SuccessOutput({ board: oldBoard });
  } catch (error) {
    return handleError(error);
  }
}

export async function getGameData(playerId: number): Promise<SuccessOutput | ErrorOutput> {
  try {
    if (!playerId) throw "Erreur interne au serveur";
    const board: Board|null= await findBoardByPlayerId(playerId);
    if (!board) throw "Erreur interne au serveur";
    const gameData = await findGameData(board.Game.id);
    if (!gameData || !gameData.game) throw "Erreur interne au serveur";
    return new SuccessOutput({ gameData });
  } catch (error) {
    return handleError(error);
  }
}

export async function removePlayerFromGame(userId: number): Promise<SuccessOutput | ErrorOutput> {
  if (!userId) throw "Erreur interne au serveur";
  try {
    const board = await findBoardByPlayerId(userId);
    if (board == null) throw "Aucune partie en cours";
    const gameId = board.GameId;
    const game: Game = board.Game;
    await board.destroy();
    const boards = await findBoardsByGameId(gameId);
    if (boards && boards.length === 0) {
      await game.destroy();
    }
    return new SuccessOutput({ gameId });
  } catch (error) {
    return handleError(error);
  }
}

export async function isOwnerOfGame(playerId: number): Promise<SuccessOutput | ErrorOutput> {
  try {
    if (!playerId) throw "Erreur interne au serveur";
    const board: Board | null = await findBoardByPlayerId(playerId);
    if (!board) throw "Erreur interne au serveur";
    const boardOwner: Board | null = await getOwnerOfGame(board.GameId);
    if (!boardOwner) throw "Erreur interne au serveur";
    const isOwner = boardOwner.PlayerId === playerId;
    return new SuccessOutput({ isOwner, board: boardOwner });
  } catch (error) {
    return handleError(error);
  }
}


export async function getOwnerOfGame(gameId: number): Promise<Board | null> {
  try {
    if (!gameId) throw "Erreur interne au serveur";
    const boards = await findBoardsByGameId(gameId);
    if (boards == null || boards.length === 0) throw "Aucune partie en cours";
    return boards[0];
  } catch (error) {
    return null;
  }
}

export async function syncModel(): Promise<SuccessOutput | ErrorOutput> {
  try {
    const s = await seq;
    await s.sequelize.sync({ force: true });
    return new SuccessOutput({ msg: "Success" });
  } catch (error) {
    return handleError(error);
  }
}

export async function getGameByPlayerId(userId: number): Promise<SuccessOutput | ErrorOutput> {
  try {
    if (!userId) throw "Erreur interne au serveur";
    const board = await findBoardByPlayerId(userId);
    if (board == null) throw "Aucune partie en cours";
    const boards = await findBoardsByGameId(board.GameId);
    return new SuccessOutput({ game: board.Game, board, boards });
  } catch (error) {
    return handleError(error);
  }
}

export async function setPlayerLobbyState(userId: number, state: boolean): Promise<SuccessOutput | ErrorOutput> {
  if (!userId) throw "Erreur interne au serveur";
  try {
    const board = await findBoardByPlayerId(userId);
    if (!board) throw "Aucune partie en cours";
    board.isReady = state;
    board.save();
    return new SuccessOutput({ board });
  } catch (error) {
    return handleError(error);
  }
}

export async function createGame(userId: number): Promise<SuccessOutput | ErrorOutput> {
  if (!userId) throw "Erreur interne au serveur";
  try {
    const currentBoard = await findBoardByPlayerId(userId);
    if (currentBoard) {
      return new SuccessOutput({ game: currentBoard.Game });
    }
    const codes: Game[] = await Game.findAll({ attributes: ['code'] });
    const game: Game = await Game.create({ code: generateUniqueCode(codes) });
    const player = await getPlayerById(userId);
    if (player == null) throw "Ce nom d'utilisateur n'existe pas";
    await GameSettings.create({ timer: 40, GameId: game.id });
    await Board.create({ avatar: 1, isReady: false, GameId: game.id, PlayerId: player.id });
    return new SuccessOutput({ game });
  } catch (error) {
    return handleError(error);
  }
}

export async function getPlayerByName(username: string): Promise<Player | null> {
  if (!username) return null;
  try {
    const player = await Player.findOne({
      where: {
        username: username
      }
    });
    return player;
  } catch (error) {
    return null;
  }
}

export async function getPlayerById(userId: number): Promise<Player | null> {
  if (!userId) return null;
  try {
    const player = await Player.findByPk(userId);
    return player;
  } catch (error) {
    return null;
  }
}

export async function findBoardByPlayerId(userId: number): Promise<Board | null> {
  if (!userId) return null;
  try {
    const board = await Board.findOne({
      where: {
        PlayerId: userId
      },
      include: [{
        model: Game
      }]
    });
    return board;
  } catch (error) {
    console.error(error);
    return null;
  }
}
export async function findGameData(gameId: number): Promise<{ game: Game|null, cards: CardSettings[], states: GameState[] } | null> {
  try {
    if (!gameId) throw "Erreur interne";
    const game = await Game.findByPk(gameId, {
      include: [{
        model: Board,
        include: [{
          model: Player,
          attributes: ['id', 'username']
        }, {
          model: Position,
          include: [{
            model: CardSettings
          }]
        }]
      }, {
        model: GameSettings
      }, {
        model: Card,
        include: [{
          model: Player,
          attributes: ['id', 'username']
        }]
      }]
    });
    const cards: CardSettings[] = await CardSettings.findAll({
      include: [{
        model: CardType
      }, {
        model: CardTaxAmount
      }, {
        model: CardPurchasePrize
      }, {
        model: Position
      }]
    });
    const states: GameState[] = await GameState.findAll();
    return { game, cards, states };
  } catch (error) {
    return null;
  }
}


export async function findBoardsByGameId(gameId: number): Promise<Board[] | null> {
  if (!gameId) return null;
  try {
    const game = await Game.findByPk(gameId, {
      include: [{
        model: Board,
        include: [{
          model: Player,
          attributes: ['id', 'username']
        }]
      }]
    });
    if (!game) throw "Erreur";
    return game.Boards;
  } catch (error) {
    return null;
  }
}

export async function createPlayer(username: string, email: string, password: string): Promise<SuccessOutput | ErrorOutput> {
  try {
    if (!username || !email || !password) throw "Erreur interne au serveur";
    if (await exports.getPlayerByName(username) != null) throw "Ce nom d'utilisateur est déjà prit";
    const key = crypto.randomBytes(32).toString('hex');
    const player = await Player.create({ username: username, email: email, password: password, key: key });
    return new SuccessOutput({ player });
  } catch (error) {
    return handleError(error);
  }
}

export async function loginPlayer(username: string, password: string): Promise<SuccessOutput | ErrorOutput> {
  try {
    if (!username || !password) throw "Erreur interne au serveur";
    const Player = await exports.getPlayerByName(username);
    if (Player == null) throw "Ce nom d'utilisateur n'existe pas";
    if (Player.password != CryptoJS.HmacSHA256(password, token['ENCRYPT_KEY']).toString()) throw "Le mot de passe n'est pas correct";
    const payload = {
      id: Player.id,
      username: Player.username,
      email: Player.email
    }
    return new SuccessOutput({ id: Player.dataValues.id, username: Player.dataValues.username, key: jwt.sign(payload, Player.key) });
  } catch (error: any) {
    return handleError(error);
  }
}

function handleError(error: any): ErrorOutput {
  const message: string = error.original ? "Une erreur est survenue (" + error.original.code + ")" : error;
  return new ErrorOutput(true, message);
}

function generateUniqueCode(listeCodes: any): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code;
  do {
    code = characters.charAt(Math.floor(Math.random() * characters.length));
    code += Math.floor(Math.random() * 10);
    code += Math.floor(Math.random() * 10);
    code += Math.floor(Math.random() * 10);
    code += Math.floor(Math.random() * 10);
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  } while (listeCodes.includes(code));
  return code;
}

// Interfaces

export class ErrorOutput {
  error: boolean;
  message: string
  constructor(error: boolean, message: string) {
    this.error = error;
    this.message = message;
  }
}

export class SuccessOutput {
  data: any
  constructor(data: any) {
    this.data = data;
  }
}

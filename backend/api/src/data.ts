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

import { Sequelize, sequelize } from './../models';

import CryptoJS from 'crypto-js';
import crypto from 'crypto';
import token from './../../tokens/tokens.json';
import jwt from 'jsonwebtoken';
import { exit } from 'process';


export async function getGameByCode(code: string): Promise<any> {
  if (!code) exit();
  const game = await Game.findOne({
    where: {
      code: code
    },
    attributes: ['isOver', 'isStarted'],
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



export async function createGame(userId: number): Promise<SuccessOutput | ErrorOutput> {
  if (!userId) throw "Erreur interne au serveur";
  try {
    const codes: Game[] = await Game.findAll({ attributes: ['code'] });
    const game: Game = await Game.create({ code: generateUniqueCode(codes) });
    const player = await getPlayerById(userId);
    if (player == null) throw "Ce nom d'utilisateur n'existe pas";
    const gameSettings = GameSettings.create({ timer: 40, gameId: game.id });
    const board = await Board.create({ avatar: 1, isReady: false, gameId: game.id, playerId: player.id });
    return new SuccessOutput({ Game });
  } catch (error) {
    return handleError(error);
  }
}

export async function getPlayerByName(username: string): Promise<Player|null> {
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

export async function getPlayerById(userId: number): Promise<Player|null> {
  if (!userId) return null;
  try {
    const player = await Player.findByPk(userId);
    return player;
  } catch (error) {
    return null;
  }
}

export async function createPlayer(username: string, email: string, password: string) : Promise<SuccessOutput | ErrorOutput>{
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

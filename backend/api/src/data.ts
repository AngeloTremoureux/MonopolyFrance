import Board from './../models/board';
import Bot from './../models/bot';
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



export async function createGame(userId: string): Promise<any> {
  // if (!userId) return;
  // try {
  //   const codes = await Model.Game.findAll({ attributes: ['code'] });
  //   const Game = await Model.Game.create({ code: generateUniqueCode(codes) });
  //   const Player = await Model.Player.create({ username: username });
  //   const GameSettings = await Model.Game_Settings.create({ timer: 40, GameId: Game.id });
  //   const Board = await Model.Board.create({ avatar: 1, isReady: 0, GameId: Game.id, PlayerId: Player.id });
  //   return jwtSign(Game, Player, Board);
  // } catch (error) {
  //   console.log("error", error);
  //   return null;
  // }
}

export async function getPlayerByName(username: string): Promise<any> {
  if (!username) return;
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

export async function verifyJwt(jwt: string, username: string): Promise<SuccessOutput | ErrorOutput> {
  try {
    if (!jwt || !username) throw "Erreur interne au serveur";
    const Player = await exports.getPlayerByName(username);
    if (Player == null) throw "Ce nom d'utilisateur n'existe pas";
    if (Player.key !== jwt) throw "Clé invalide";
    return { data: { id: Player.dataValues.id, username: Player.dataValues.username, key: Player.dataValues.key } };
  } catch (error) {
    return handleError(error);
  }
}

export async function createPlayer(username: string, email: string, password: string) : Promise<SuccessOutput | ErrorOutput>{
  try {
    if (!username || !email || !password) throw "Erreur interne au serveur";
    if (await exports.getPlayerByName(username) != null) throw "Ce nom d'utilisateur est déjà prit";
    const key = crypto.randomBytes(32).toString('hex');
    const player = await Player.create({ username: username, email: email, password: password, key: key });
    return { data: player };
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
    return { data: { id: Player.dataValues.id, username: Player.dataValues.username, key: jwt.sign(payload, Player.key) } };
  } catch (error: any) {
    return handleError(error);
  }
}

function handleError(error: any): ErrorOutput {
  const message: string = error.original ? "Une erreur est survenue (" + error.original.code + ")" : error;
  return { error: true, message };
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
  error!: boolean;
  message!: string
}

export class SuccessOutput {
  data!: any
}

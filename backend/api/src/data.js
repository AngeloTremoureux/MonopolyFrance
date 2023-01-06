const Model = require('./../models');

exports.getGameByCode = async function (code) {
  if (!code) return;
  const Game = await Model.Game.findOne({
    where: {
      code: code
    },
    attributes: ['isOver', 'isStarted'],
    include: [
      {
        model: Model.Game_Settings
      }, {
        model: Model.Card,
        include: [{
          model: Model.Card_Settings,
          include: [{
            model: Model.Card_Type
          }]

        }]
      }, {
        model: Model.Board,
        include: [{
          model: Model.Position,
          attributes: ['numero']
        }, {
          model: Model.Player
        }]
      }
    ]
  });
  return Game;
}

exports.createGame = async function (username) {
  if (!username) return;
  try {
    const codes = await Model.Game.findAll({ attributes: ['code'] });
    const Game = await Model.Game.create({ code: generateUniqueCode(codes) });
    const Player = await Model.Player.create({ username: username });
    const GameSettings = await Model.Game_Settings.create({ timer: 40, GameId: Game.id });
    const Board = await Model.Board.create({ avatar: 1, isReady: 0, GameId: Game.id, PlayerId: Player.id });
    return jwtSign(Game, Player, Board);
  } catch (error) {
    console.log("error", error);
    return null;
  }
}

exports.getPlayerByName = async function (username) {
  if (!username) return;
  try {
    const Player = await Model.Player.findOne({
      where: {
        username: username
      }
    });
    return Player;
  } catch (error) {
    return null;
  }
}

exports.createPlayer = async function (username, email, password) {
  try {
    if (!username || !email || !password) throw "Erreur interne au serveur";
    if (exports.getPlayerByName(username) != null) throw "Ce nom d'utilisateur est déjà prit";
    const Player = await Model.Player.create({ username: username, email: email, password: password });
    return { data: Player};
  } catch (error) {
    return handleError(error);
  }
}

function handleError(error) {
  const message = error.original ? "Une erreur est survenue (" + error.original.code + ")" : error;
  return { error: true, message };
}


function jwtSign(Game, Player, Board) {
  const sign = {
    playerId : Player.id,
    gameId   : Game.id,
    boardId  : Board.id
  }
  return sign;
}

function generateUniqueCode(listeCodes) {
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

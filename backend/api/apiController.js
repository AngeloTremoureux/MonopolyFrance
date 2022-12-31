const Model = require('./models');
const dataManager = require('./src/data');

// Listening Events SOCKET.IO

exports.manageSocket = async function(socket) {
  socket.on("game_gameId_get", async (code) => {
    if (!code) return;
    receiveLog(socket, "game_gameId_get", code);
    const response = await dataManager.getGameByCode(code);
    await sleep(500);
    emit(socket, "game_gameId_get", response);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function receiveLog(socket, receiveString, data) {
  console.log("\x1b[0m[", socket.id, "]\x1b[36m", "Receive >", capitalizeFirstLetter(receiveString), ", \x1b[2mdata:", data, "\x1b[0m");
}

function emit(socket, emitString, data) {
  socket.emit(emitString, data);
  console.log("\x1b[0m[", socket.id, "]\x1b[31m", "Emit    <", capitalizeFirstLetter(emitString), ", \x1b[2mdata:", data ? data.constructor.name : null, "\x1b[0m");
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Access PUBLIC API

exports.user_player_get = async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  if (req.params.playerId) {
    const Player = await Model.Player.findByPk(req.params.playerId, {
      include: [
        {
          model: Model.Board,
          include: {
            model: Model.Game
          }
        }
      ]
    });
    renderJson(res, Player);
  } else {
    renderErrorJson(res);
  }
}

exports.chances_get = async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  const Chances = await Model.Chance.findAll();
  renderJson(res, Chances);
}

exports.chances_chanceId_get = async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  const { chanceId } = req.params;
  if (chanceId) {
    const Chance = await Model.Chance.findByPk(chanceId);
    if (Chance) {
      renderJson(res, Chance);
    } else {
      renderErrorJson(res);
    }
  } else {
    renderErrorJson(res);
  }
}

exports.game_cards_get = async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  const Card_Settings = await Model.Card_Settings.findAll({
    attributes: ['id', 'nom', 'color'],
    include: [{
      model: Model.Card_Purchase_Prize,
      attributes: ['cost'],
    }, {
      model: Model.Card_Tax_Amount,
      attributes: ['cost']
    }, {
      model: Model.Card_Type
    }]
  });
  const jsonData = JSON.stringify(Card_Settings);

  res.end(jsonData);
}

exports.game_gameId_player_position_get = async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  const { gameId, playerId } = req.params;
  if (gameId && playerId) {
    console.log(gameId)
    const Board = await Model.Board.findOne({
      where: {
        GameId: gameId,
        PlayerId: playerId
      },
      attributes: [],
      include: [
        {
          model: Model.Position,
          attributes: ['numero']
        }
      ]
    });
    if (Board && Board.Position) {
      renderJson(res, Board.Position);
    } else {
      renderErrorJson(res);
    }
  } else {
    renderErrorJson(res);
  }
}

exports.get_room_code = async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  if (req.params.code) {
    const Game = await Model.Game.findOne({
      where: {
        code: req.params.code
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
    renderJson(res, Game);
  } else {
    renderErrorJson(res);
  }
}

exports.game_gameId_get = async function (req, res) {
  console.log("ok")
  res.setHeader('Content-Type', 'application/json');
  if (req.params.gameId) {
    const Game = await Model.Game.findByPk(req.params.gameId, {
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
    renderJson(res, Game);
  } else {
    renderErrorJson(res);
  }
}

exports.game_gameId_lobby_get = async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  if (req.params.gameId) {
    const Game = await Model.Game.findByPk(req.params.gameId, {
      include: [
        {
          model: Model.Game_Settings,
          model: Model.Board,
          include: {
            model: Model.Player
          }
        }
      ]
    });
    renderJson(res, Game);
  } else {
    renderErrorJson(res);
  }
}

exports.game_card_anonymous_get = function (req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.render('api/lobby/card-anonymous', {});
}

exports.card_numcard_get = async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  if (req.params.numCard) {
    const CardSettings = await Model.Card_Settings.findByPk(req.params.numCard, {
      include: [
        {
          model: Model.Card_Type
        }
      ]
    });
    renderJson(res, CardSettings);
  } else {
    renderErrorJson(res);
  }
}

function renderJson(res, data) {
  if (data) {
    res.end(JSON.stringify(data));
  } else {
    res.status(400).end(JSON.stringify({ data: null }));
  }
}

function renderErrorJson(res) {
  res.status(400).end(JSON.stringify({ data: null }));
}

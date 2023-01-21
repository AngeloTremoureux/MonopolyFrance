import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import Board from "./models/board";
import Card from "./models/card";
import Position from "./models/position";
import * as dataManager from './src/data';
import { SuccessOutput, ErrorOutput } from "./src/data";

// Listening Events SOCKET.IO

export async function handleSocket(socket: Socket, io: Server<any, any, DefaultEventsMap, any>): Promise<void> {
  // Global Socket
  socket.onAny((eventName, ...args) => receiveLog(socket, eventName, args));

  socket.on("administrator_sync_db", () => {
    dataManager.syncModel();
  });

  socket.on("socket_is_logged", async (callback) => {
    if (!callback) return;
    if ((socket as any).decoded) {
      callback({ success: true, data: (socket as any).decoded });
    } else {
      callback({ success: false, data: null });
    }
  });

  // Socket handler
  socket.on("join_game", async (code, callback) => {
    if (!code || !callback) return;
    if (!(socket as any).decoded) return;
    const { id } = (socket as any).decoded;
    await dataManager.addPlayerToGame(id, code);
    // Verification
    const board: SuccessOutput | ErrorOutput = await dataManager.getGameByPlayerId(id);
    if (board instanceof SuccessOutput) {
      console.log("p=", board.data.Player)
      socket.join(board.data.game.id);
      // Broadcast
      socket.rooms.forEach((room: any) => {
        if (Number.isInteger(room)) {
          socket.to(room).emit("newPlayer", { Board: board.data.boards.find((x: any) => x.PlayerId === id) });
        }
      })
      callback({ success: true, data: null });
    } else {
      callback({ success: false, data: null });
    }
  });

  socket.on("get_game_data", async (callback) => {
    if (!callback) return;
    if (!(socket as any).decoded) return;
    const { id } = (socket as any).decoded;
    if (!id) return;
    const game: SuccessOutput | ErrorOutput = await dataManager.getGameData(id);
    console.log(game);
    if (game instanceof SuccessOutput) {
      callback({ success: true, data: game.data.gameData });
    } else {
      callback({ success: false, data: null });
    }
  });

  socket.on("get_game_end_move", async () => {
    if (!(socket as any).decoded) return;
    const { id } = (socket as any).decoded;
    if (!id) return;
    const position: Position | null = await dataManager.findPositionByBoardId(id);
    const card: Card | null = await dataManager.findCurrentCardInGameOfPlayer(id);
    if (!position) return;
    // if (card && (position.Card_Setting.CardTypeId === 1 || position.Card_Setting.CardTypeId === 2)) {
    //   // TO DO : Case is already owned by other player
    //   const cardLevel = card.level;
    //   if (card) {
    //     socket.emit('open_modal', { numero: currentNumCard.numero, params: {} });
    //   } else {
    //     await dataManager.removeMoneyFromPlayer(socket, boardId, Card.Card_Setting.Card_Tax_Amounts[level - 1].cost);
    //     await dataManager.changePlayerTurn(currentNumCard.Board.Game.Game_Setting);
    //   }
    //   // Remove card tax prize from account balance of player
    // } else {
    //   let turn;
    //   const Game_Settings = currentNumCard.Board.Game.Game_Setting;
    //   switch (cardTypeId) {
    //     // Case 3 : Starting card
    //     case 3:
    //       turn = await changePlayerTurn(Game_Settings);
    //       socket.to(gameId).emit('update_turn', { turn });
    //       socket.emit('update_turn', { turn });
    //       break;
    //     // Case 4 : Lost island card
    //     case 4:
    //       turn = await changePlayerTurn(Game_Settings);
    //       socket.to(gameId).emit('update_turn', { turn });
    //       socket.emit('update_turn', { turn });
    //       break;
    //     // Case 5 : World Cup
    //     case 5:
    //       turn = await changePlayerTurn(Game_Settings);
    //       socket.to(gameId).emit('update_turn', { turn });
    //       socket.emit('update_turn', { turn });
    //       break;
    //     // Case 6 : Aeroport card
    //     case 6:
    //       turn = await changePlayerTurn(Game_Settings);
    //       socket.to(gameId).emit('update_turn', { turn });
    //       socket.emit('update_turn', { turn });
    //       break;
    //     // Case 7 : Chance card
    //     case 7:
    //       const chanceCardNumber = Math.floor(Math.random() * 10 + 1);
    //       socket.emit('open_modal', { numero: currentNumCard.numero, params: { chance: chanceCardNumber } });
    //       break;
    //     case 8:
    //       const taxAmount = 50000;
    //       removeMoneyFromPlayer(socket, boardId, taxAmount);
    //       socket.to(gameId).emit('tax_player', { player: playerId, amount: taxAmount });
    //       socket.emit('tax_player', { player: playerId, amount: taxAmount });
    //       break;
    //     // Others (City or monument)
    //     default:
    //       socket.emit('open_modal', { numero: currentNumCard.numero, params: {} });
    //   }
    // }
  });

  socket.on("get_click_game_roll", async () => {
    if (!(socket as any).decoded) return;
    const { id } = (socket as any).decoded;
    if (!id) return;
    const board: Board | null = await dataManager.findBoardAdvancedByPlayerId(id);
    if (!board || board.Game.isOver || board.Game.Game_Setting.GameStateId !== 1 || !board.Game.isStarted || board.Game.Boards[board.Game.Game_Setting.playerTurn - 1].PlayerId !== id) return;
    // Dans tous les cas : on déplace le joueur
    const face1 = Math.floor(Math.random() * 6 + 1);
    const face2 = Math.floor(Math.random() * 6 + 1);
    await dataManager.setPlayerPosition(board.id, face1 + face2);
    // Change GameState
    board.Game.Game_Setting.GameStateId = 3;
    board.Game.Game_Setting.save();

    // // Change PlayerTurn
    // const sizeOfGame = board.Game.Boards.length;
    // if (board.Game.Game_Setting.playerTurn + 1 <= sizeOfGame) {
    //   board.Game.Game_Setting.playerTurn++;
    // } else {
    //   board.Game.Game_Setting.playerTurn = 1;
    // }
    const durationPosition1 = Math.floor(Math.random() * 1120 + 1080);
    const durationPosition2 = Math.floor(Math.random() * 1120 + 1080);
    const durations = { durationPosition1, durationPosition2 };
    io.to(board.GameId.toString()).emit("diceRolled", { boardId: board.id, dice1: face1, dice2: face2, durations });
  });

  socket.on("kick_lobby", async (playerId) => {
    if (!playerId) return;
    if (!(socket as any).decoded) return;
    const { id } = (socket as any).decoded;
    if (!id) return;
    const board: SuccessOutput | ErrorOutput = await dataManager.kickPlayerFromGame(id, playerId);
    if (board instanceof SuccessOutput) {
      io.to(board.data.board.GameId).emit("removePlayer", playerId);
    } else {
      console.error(board);
    }
  });

  socket.on("start_game", async () => {
    if (!(socket as any).decoded) return;
    const { id } = (socket as any).decoded;
    if (!id) return;
    const board: SuccessOutput | ErrorOutput = await dataManager.startGame(id);
    if (board instanceof SuccessOutput) {
      io.to(board.data.board.GameId).emit("startGame");
    } else {
      console.error(board);
    }
  });

  socket.on("leave_lobby", async (callback) => {
    if (!callback) return;
    if (!(socket as any).decoded) return;
    const { id } = (socket as any).decoded;
    if (!id) return;
    const board: SuccessOutput | ErrorOutput = await dataManager.removePlayerFromGame(id);
    if (board instanceof SuccessOutput) {
      socket.to(board.data.gameId).emit("removePlayer", id);
      socket.rooms.clear();
      callback({ success: true, data: null });
    } else {
      callback({ success: false, data: null });
    }
  });

  socket.on("get_current_game", async (callback) => {
    if (!callback) return;
    if (!(socket as any).decoded) return;
    const { id } = (socket as any).decoded;
    const board: SuccessOutput | ErrorOutput = await dataManager.getGameByPlayerId(id);
    if (board instanceof SuccessOutput) {
      socket.join(board.data.game.id);
      callback({ success: true, data: board.data });
    } else {
      callback({ success: false, data: null });
    }
  });

  socket.on("set_lobby_state", async (state) => {
    const { id } = (socket as any).decoded;
    if (state === undefined || state === null || !id || !socket.rooms) return;
    //await sleep(2000)
    const board: SuccessOutput | ErrorOutput = await dataManager.setPlayerLobbyState(id, state);
    if (board instanceof SuccessOutput) {
      socket.rooms.forEach((room: any) => {
        if (Number.isInteger(room)) {
          io.to(room).emit("update_lobby_state", { PlayerId: board.data.board.PlayerId, isReady: board.data.board.isReady });
        }
      })
    } else {
      console.error("Une erreur est survenue")
    }
  });

  socket.on("create_game", async (callback) => {
    if (!callback) return;
    if (!(socket as any).decoded) return;
    const { id } = (socket as any).decoded;
    if (!id) return;
    const game: SuccessOutput | ErrorOutput = await dataManager.createGame(id);
    if (game instanceof SuccessOutput) {
      callback({ success: true, data: game.data });
    } else {
      callback({ success: false, data: game });
    }
  });

  socket.on("signup", async (data, callback) => {
    if (!data || !callback) return;
    const player: SuccessOutput | ErrorOutput = await dataManager.createPlayer(data.name, data.email, data.password);
    if (player instanceof SuccessOutput) {
      callback({ success: true, data: player.data });
    } else {
      callback({ success: false, data: player });
    }
  });

  socket.on("signin", async (data, callback) => {
    if (!data || !callback) return;
    const player: SuccessOutput | ErrorOutput = await dataManager.loginPlayer(data.name, data.password);
    if (player instanceof SuccessOutput) {
      callback({ success: true, data: player.data });
    } else {
      callback({ success: false, data: player });
    }
  });
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function receiveLog(socket: Socket, receiveString: string, data: any) {
  console.log("\x1b[0m[", socket.id, "]\x1b[36m", "Receive >", capitalizeFirstLetter(receiveString), ", \x1b[2mdata:", data, "\x1b[0m");
}

function emit(socket: Socket, emitString: string, data: any) {
  socket.emit(emitString, data);
  console.log("\x1b[0m[", socket.id, "]\x1b[31m", "Emit    <", capitalizeFirstLetter(emitString), ", \x1b[2mdata:", data ? data.constructor.name : null, "\x1b[0m");
}

function capitalizeFirstLetter(string: String) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

  // Access PUBLIC API

  // exports.user_player_get = async function (req, res) {
  //   res.setHeader('Content-Type', 'application/json');
  //   if (req.params.playerId) {
  //     const Player = await Model.Player.findByPk(req.params.playerId, {
  //       include: [
  //         {
  //           model: Model.Board,
  //           include: {
  //             model: Model.Game
  //           }
  //         }
  //       ]
  //     });
  //     renderJson(res, Player);
  //   } else {
  //     renderErrorJson(res);
  //   }
  // }

  // exports.chances_get = async function (req, res) {
  //   res.setHeader('Content-Type', 'application/json');
  //   const Chances = await Model.Chance.findAll();
  //   renderJson(res, Chances);
  // }

  // exports.chances_chanceId_get = async function (req, res) {
  //   res.setHeader('Content-Type', 'application/json');
  //   const { chanceId } = req.params;
  //   if (chanceId) {
  //     const Chance = await Model.Chance.findByPk(chanceId);
  //     if (Chance) {
  //       renderJson(res, Chance);
  //     } else {
  //       renderErrorJson(res);
  //     }
  //   } else {
  //     renderErrorJson(res);
  //   }
  // }

  // exports.game_cards_get = async function (req, res) {
  //   res.setHeader('Content-Type', 'application/json');
  //   const Card_Settings = await Model.Card_Settings.findAll({
  //     attributes: ['id', 'nom', 'color'],
  //     include: [{
  //       model: Model.Card_Purchase_Prize,
  //       attributes: ['cost'],
  //     }, {
  //       model: Model.Card_Tax_Amount,
  //       attributes: ['cost']
  //     }, {
  //       model: Model.Card_Type
  //     }]
  //   });
  //   const jsonData = JSON.stringify(Card_Settings);

  //   res.end(jsonData);
  // }

  // exports.game_gameId_player_position_get = async function (req, res) {
  //   res.setHeader('Content-Type', 'application/json');
  //   const { gameId, playerId } = req.params;
  //   if (gameId && playerId) {
  //     console.log(gameId)
  //     const Board = await Model.Board.findOne({
  //       where: {
  //         GameId: gameId,
  //         PlayerId: playerId
  //       },
  //       attributes: [],
  //       include: [
  //         {
  //           model: Model.Position,
  //           attributes: ['numero']
  //         }
  //       ]
  //     });
  //     if (Board && Board.Position) {
  //       renderJson(res, Board.Position);
  //     } else {
  //       renderErrorJson(res);
  //     }
  //   } else {
  //     renderErrorJson(res);
  //   }
  // }

  // exports.get_room_code = async function (req, res) {
  //   res.setHeader('Content-Type', 'application/json');
  //   if (req.params.code) {
  //     const Game = await Model.Game.findOne({
  //       where: {
  //         code: req.params.code
  //       },
  //       attributes: ['isOver', 'isStarted'],
  //       include: [
  //         {
  //           model: Model.Game_Settings
  //         }, {
  //           model: Model.Card,
  //           include: [{
  //             model: Model.Card_Settings,
  //             include: [{
  //               model: Model.Card_Type
  //             }]

  //           }]
  //         }, {
  //           model: Model.Board,
  //           include: [{
  //             model: Model.Position,
  //             attributes: ['numero']
  //           }, {
  //             model: Model.Player
  //           }]
  //         }
  //       ]
  //     });
  //     renderJson(res, Game);
  //   } else {
  //     renderErrorJson(res);
  //   }
  // }

  // exports.game_gameId_get = async function (req, res) {
  //   console.log("ok")
  //   res.setHeader('Content-Type', 'application/json');
  //   if (req.params.gameId) {
  //     const Game = await Model.Game.findByPk(req.params.gameId, {
  //       attributes: ['isOver', 'isStarted'],
  //       include: [
  //         {
  //           model: Model.Game_Settings
  //         }, {
  //           model: Model.Card,
  //           include: [{
  //             model: Model.Card_Settings,
  //             include: [{
  //               model: Model.Card_Type
  //             }]

  //           }]
  //         }, {
  //           model: Model.Board,
  //           include: [{
  //             model: Model.Position,
  //             attributes: ['numero']
  //           }, {
  //             model: Model.Player
  //           }]
  //         }
  //       ]
  //     });
  //     renderJson(res, Game);
  //   } else {
  //     renderErrorJson(res);
  //   }
  // }

  // exports.game_gameId_lobby_get = async function (req, res) {
  //   res.setHeader('Content-Type', 'application/json');
  //   if (req.params.gameId) {
  //     const Game = await Model.Game.findByPk(req.params.gameId, {
  //       include: [
  //         {
  //           model: Model.Game_Settings,
  //           model: Model.Board,
  //           include: {
  //             model: Model.Player
  //           }
  //         }
  //       ]
  //     });
  //     renderJson(res, Game);
  //   } else {
  //     renderErrorJson(res);
  //   }
  // }

  // exports.game_card_anonymous_get = function (req, res) {
  //   res.setHeader('Content-Type', 'text/html');
  //   res.render('api/lobby/card-anonymous', {});
  // }

  // exports.card_numcard_get = async function (req, res) {
  //   res.setHeader('Content-Type', 'application/json');
  //   if (req.params.numCard) {
  //     const CardSettings = await Model.Card_Settings.findByPk(req.params.numCard, {
  //       include: [
  //         {
  //           model: Model.Card_Type
  //         }
  //       ]
  //     });
  //     renderJson(res, CardSettings);
  //   } else {
  //     renderErrorJson(res);
  //   }
  // }

  // function renderJson(res, data) {
  //   if (data) {
  //     res.end(JSON.stringify(data));
  //   } else {
  //     res.status(400).end(JSON.stringify({ data: null }));
  //   }
  // }

  // function renderErrorJson(res) {
  //   res.status(400).end(JSON.stringify({ data: null }));
  // }

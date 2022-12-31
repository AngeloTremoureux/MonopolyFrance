const express = require('express');
const router = express.Router();
const api_controller = require('./apiController');

router.get('/status', ((req, res) => res.status(200).json({ status: "UP" })));

router.get('/user/:playerId',                         api_controller.user_player_get);
router.get('/game/cards',                             api_controller.game_cards_get)
router.get('/game/:gameId/lobby',                     api_controller.game_gameId_lobby_get);
router.get('/game/:gameId/player/:playerId/position', api_controller.game_gameId_player_position_get)
router.get('/game/:gameId',                           api_controller.game_gameId_get);
router.get('/game/card/anonymous',                    api_controller.game_card_anonymous_get);
router.get('/chances',                                api_controller.chances_get);
router.get('/chances/:chanceId',                      api_controller.chances_chanceId_get);
router.get('/card/:numCard',                          api_controller.card_numcard_get);
router.get('/room/:code',                             api_controller.get_room_code);


module.exports = router;

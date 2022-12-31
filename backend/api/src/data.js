const Model = require('./../models');

exports.getGameByCode = async function(code) {
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

exports.getGameById = async function(code) {
  if (!code) return;

}

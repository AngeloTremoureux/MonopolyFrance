'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('game_states', null, {});
    await queryInterface.bulkInsert('game_states', [
      { id: 1, message: 'Au joueur de lancer les dés' },
      { id: 2, message: 'En attente d\'un achat' },
      { id: 3, message: null },
  ]);
},

async down (queryInterface, Sequelize) {
  /**
   * Add commands to revert seed here.
   *
   * Example:
   * await queryInterface.bulkDelete('People', null, {});
   */
}
};

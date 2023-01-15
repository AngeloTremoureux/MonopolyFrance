'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('chances', null, {});
    await queryInterface.bulkInsert('chances', [
      { id: 1, message: 'Vous devez payer une amende de 50 000 $', logo_url: '/images/game/mrmonopoly1.png' },
      { id: 2, message: 'Chosisssez une ville qui organise la coupe du monde', logo_url: '/images/game/mrmonopoly1.png' },
      { id: 3, message: 'Rendez-vous directement sur la case Ile perdu', logo_url: '/images/game/mrmonopoly1.png' },
      { id: 4, message: 'Réduisez une ville à néant', logo_url: '/images/game/mrmonopoly1.png' },
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

'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('card_types', null, {});
    await queryInterface.bulkInsert('card_types', [
      { id: 1, nom: "Ville" },
      { id: 2, nom: "Monument" },
      { id: 3, nom: "Départ" },
      { id: 4, nom: "Ile Perdu" },
      { id: 5, nom: "Coupe du monde" },
      { id: 6, nom: "Aéroport" },
      { id: 7, nom: "Chance" },
      { id: 8, nom: "Taxe" },
    ], {});
  },

  async down (queryInterface, Sequelize) {
  }
};

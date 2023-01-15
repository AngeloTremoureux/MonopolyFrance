'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('card_settings', null, {});
    await queryInterface.bulkInsert('card_settings', [
      {
        id: 1,
        nom: "Case départ",
        CardTypeId: 3,
        color: null
      }, {
        id: 2,
        nom: "Bastia",
        CardTypeId: 1,
        color: 5841671
      }, {
        id: 3,
        nom: "Arles",
        CardTypeId: 1,
        color: 5841671
      }, {
        id: 4,
        nom: "Lorient",
        CardTypeId: 1,
        color: 5841671
      }, {
        id: 5,
        nom: "Musée d'Orsay",
        CardTypeId: 2,
        color: 1326341
      }, {
        id: 6,
        nom: "Cannes",
        CardTypeId: 1,
        color: 4671303
      }, {
        id: 7,
        nom: "Roubaix",
        CardTypeId: 1,
        color: 4671303
      }, {
        id: 8,
        nom: "Nancy",
        CardTypeId: 1,
        color: 4671303
      }, {
        id: 9,
        nom: "Ile perdu",
        CardTypeId: 4,
        color: null
      }, {
        id: 10,
        nom: "Tours",
        CardTypeId: 1,
        color: 12213164
      }, {
        id: 11,
        nom: "Brest",
        CardTypeId: 1,
        color: 12213164
      }, {
        id: 12,
        nom: "Nîmes",
        CardTypeId: 1,
        color: 12213164
      }, {
        id: 13,
        nom: "Disney Land",
        CardTypeId: 2,
        color: 4208169
      }, {
        id: 14,
        nom: "Chance",
        CardTypeId: 7,
        color: null
      }, {
        id: 15,
        nom: "Angers",
        CardTypeId: 1,
        color: 8737292
      }, {
        id: 16,
        nom: "Dijon",
        CardTypeId: 1,
        color: 8737292
      }, {
        id: 17,
        nom: "Coupe du monde",
        CardTypeId: 5,
        color: null
      }, {
        id: 18,
        nom: "Toulon",
        CardTypeId: 1,
        color: 876966
      }, {
        id: 19,
        nom: "Le Louvre",
        CardTypeId: 2,
        color: 5064462
      }, {
        id: 20,
        nom: "Reims",
        CardTypeId: 1,
        color: 876966
      }, {
        id: 21,
        nom: "Chance",
        CardTypeId: 7,
        color: null
      }, {
        id: 22,
        nom: "Rennes",
        CardTypeId: 1,
        color: 7671576
      }, {
        id: 23,
        nom: "Lille",
        CardTypeId: 1,
        color: 7671576
      }, {
        id: 24,
        nom: "Nantes",
        CardTypeId: 1,
        color: 7671576
      }, {
        id: 25,
        nom: "Aéroport",
        CardTypeId: 6,
        color: null
      }, {
        id: 26,
        nom: "Nice",
        CardTypeId: 1,
        color: 1202452
      }, {
        id: 27,
        nom: "Lyon",
        CardTypeId: 1,
        color: 1202452
      }, {
        id: 28,
        nom: "Tour Eiffel",
        CardTypeId: 2,
        color: 739440
      }, {
        id: 29,
        nom: "Chance",
        CardTypeId: 7,
        color: null
      }, {
        id: 30,
        nom: "Marseille",
        CardTypeId: 1,
        color: 5000934
      }, {
        id: 31,
        nom: "Taxe",
        CardTypeId: 8,
        color: 5000934
      }, {
        id: 32,
        nom: "Paris",
        CardTypeId: 1,
        color: 0xffffff
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
  }
};

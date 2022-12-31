'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "Bots", deps: []
 * createTable "Card_Types", deps: []
 * createTable "Chances", deps: []
 * createTable "Games", deps: []
 * createTable "Game_States", deps: []
 * createTable "Players", deps: []
 * createTable "Boards", deps: [Games, Players, Bots]
 * createTable "Card_Settings", deps: [Card_Types]
 * createTable "Card_Purchase_Prizes", deps: [Card_Settings]
 * createTable "Card_Tax_Amounts", deps: [Card_Settings]
 * createTable "Cards", deps: [Card_Settings, Games, Players]
 * createTable "Game_Settings", deps: [Games, Game_States]
 * createTable "Positions", deps: [Boards, Card_Settings]
 *
 **/

var info = {
    "revision": 1,
    "name": "init",
    "created": "2022-12-21T12:02:49.556Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "createTable",
        params: [
            "Bots",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true
                },
                "username": {
                    "type": Sequelize.STRING,
                    "field": "username"
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Card_Types",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true
                },
                "nom": {
                    "type": Sequelize.STRING,
                    "field": "nom"
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Chances",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true
                },
                "message": {
                    "type": Sequelize.STRING,
                    "field": "message"
                },
                "logo_url": {
                    "type": Sequelize.STRING,
                    "field": "logo_url"
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Games",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true
                },
                "code": {
                    "type": Sequelize.STRING(6),
                    "field": "code",
                    "unique": true
                },
                "isOver": {
                    "type": Sequelize.BOOLEAN,
                    "field": "isOver",
                    "defaultValue": false
                },
                "isStarted": {
                    "type": Sequelize.BOOLEAN,
                    "field": "isStarted",
                    "defaultValue": false
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Game_States",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true
                },
                "message": {
                    "type": Sequelize.STRING,
                    "field": "message"
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Players",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true
                },
                "username": {
                    "type": Sequelize.STRING,
                    "field": "username"
                },
                "isOnline": {
                    "type": Sequelize.BOOLEAN,
                    "field": "isOnline",
                    "defaultValue": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Boards",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true
                },
                "isReady": {
                    "type": Sequelize.BOOLEAN,
                    "field": "isReady",
                    "defaultValue": false,
                    "allowNull": false
                },
                "avatar": {
                    "type": Sequelize.INTEGER,
                    "field": "avatar"
                },
                "money": {
                    "type": Sequelize.INTEGER,
                    "field": "money",
                    "defaultValue": 2000000,
                    "allowNull": false
                },
                "GameId": {
                    "type": Sequelize.INTEGER,
                    "field": "GameId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "Games",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "PlayerId": {
                    "type": Sequelize.INTEGER,
                    "field": "PlayerId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "Players",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "BotId": {
                    "type": Sequelize.INTEGER,
                    "field": "BotId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "Bots",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Card_Settings",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true
                },
                "nom": {
                    "type": Sequelize.STRING,
                    "field": "nom"
                },
                "color": {
                    "type": Sequelize.INTEGER,
                    "field": "color"
                },
                "CardTypeId": {
                    "type": Sequelize.INTEGER,
                    "field": "CardTypeId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "Card_Types",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Card_Purchase_Prizes",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true
                },
                "cost": {
                    "type": Sequelize.BIGINT,
                    "field": "cost"
                },
                "CardSettingId": {
                    "type": Sequelize.INTEGER,
                    "field": "CardSettingId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "Card_Settings",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Card_Tax_Amounts",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true
                },
                "cost": {
                    "type": Sequelize.BIGINT,
                    "field": "cost"
                },
                "CardSettingId": {
                    "type": Sequelize.INTEGER,
                    "field": "CardSettingId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "Card_Settings",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Cards",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true
                },
                "level": {
                    "type": Sequelize.INTEGER,
                    "field": "level"
                },
                "CardSettingId": {
                    "type": Sequelize.INTEGER,
                    "field": "CardSettingId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "Card_Settings",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "GameId": {
                    "type": Sequelize.INTEGER,
                    "field": "GameId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "Games",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "PlayerId": {
                    "type": Sequelize.INTEGER,
                    "field": "PlayerId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "Players",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Game_Settings",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true
                },
                "timer": {
                    "type": Sequelize.INTEGER,
                    "field": "timer"
                },
                "playerTurn": {
                    "type": Sequelize.INTEGER,
                    "field": "playerTurn",
                    "allowNull": true
                },
                "nbPlayers": {
                    "type": Sequelize.INTEGER,
                    "field": "nbPlayers",
                    "allowNull": true
                },
                "GameId": {
                    "type": Sequelize.INTEGER,
                    "field": "GameId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "Games",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "GameStateId": {
                    "type": Sequelize.INTEGER,
                    "field": "GameStateId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "Game_States",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Positions",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true
                },
                "BoardId": {
                    "type": Sequelize.INTEGER,
                    "field": "BoardId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "Boards",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "numero": {
                    "type": Sequelize.INTEGER,
                    "field": "numero",
                    "onUpdate": "CASCADE",
                    "onDelete": "CASCADE",
                    "references": {
                        "model": "Card_Settings",
                        "key": "id"
                    },
                    "defaultValue": 1,
                    "name": "numero",
                    "allowNull": false
                }
            },
            {}
        ]
    }
];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};

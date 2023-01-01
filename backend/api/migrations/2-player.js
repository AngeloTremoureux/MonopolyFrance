'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "password" to table "Players"
 * addColumn "email" to table "Players"
 *
 **/

var info = {
    "revision": 2,
    "name": "player",
    "created": "2023-01-01T20:01:29.611Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "addColumn",
        params: [
            "Players",
            "password",
            {
                "type": Sequelize.STRING,
                "field": "password"
            }
        ]
    },
    {
        fn: "addColumn",
        params: [
            "Players",
            "email",
            {
                "type": Sequelize.STRING,
                "field": "email",
                "allowNull": true
            }
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

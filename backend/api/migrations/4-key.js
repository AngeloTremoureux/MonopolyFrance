'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "key" to table "Players"
 *
 **/

var info = {
    "revision": 4,
    "name": "key",
    "created": "2023-01-07T16:50:03.302Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "addColumn",
    params: [
        "Players",
        "key",
        {
            "type": Sequelize.STRING,
            "field": "key"
        }
    ]
}];

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

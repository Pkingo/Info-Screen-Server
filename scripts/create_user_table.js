var mysql = require('mysql');
var Config = require('../config');
var Tables = require('../types/table');

var connection = mysql.createConnection({
    host        : Config.hostname,
    port        : Config.port,
    user        : Config.username,
    password    : Config.password,
    database    : Config.database,
});

connection.query('CREATE DATABASE ' + Config.database);

connection.query('\
CREATE TABLE `' + Config.database + '`.`' + Tables.Users + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `username` VARCHAR(20) NOT NULL, \
    `password` CHAR(60) NOT NULL, \
        PRIMARY KEY (`id`), \
)');

console.log('Success: Database Created!')

connection.end();

var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var Config = require('../config');
var Tables = require('../types/table');

var connection = mysql.createConnection({
    host: Config.hostname,
    port: Config.port,
    user: Config.username,
    password: Config.password,
});

connection.query('USE ' + Config.database);
module.exports = function (passport) {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        connection.query(`SELECT * FROM ${Tables.Users} WHERE id = ?`, [id], (err, rows) => {
            done(err, rows[0]);
        });
    });

    passport.use('local-signup', new LocalStrategy({ usernameField: 'username', passwordField: 'password', passReqToCallback: true }, (req, username, password, done) => {
        connection.query(`SELECT * FROM ${Tables.Users} WHERE username = ?`, [username], (err, rows) => {
            if (err) return done(err);
            if (rows.length) return done(null, flase, req.flash('signipMessage', 'That username is already taken.'));
            else {
                var newUserMySQL = {
                    username: username,
                    password: bcrypt.hashSync(password, null, null)
                };
                var insertQuery = `INSERT INTO ${Tables.Users} ( username, password) values ( ?, ?)`;
                connection.query(insertQuery, [newUserMySQL.username, newUserMySQL.password], function (err, rows) {
                    if (err) throw err;
                    newUserMySQL.id = rows.insertId;
                    return done(null, newUserMySQL);
                });
            }
        });
    }));

    passport.use('local-login', new LocalStrategy({ usernameField: 'username', passwordField: 'password', passReqToCallback: true }, (req, username, password, done) => {
        connection.query(`SELECT * FROM ${Tables.Users} WHERE username = ?`, [username], (err, rows) => {
            if (err) return done(err);
            console.log("No errors");
            if (!rows.length) return done(null, false, req.flash('loginMessage', 'No user found'));
            console.log("No other users");
            console.log();
            if (!bcrypt.compareSync(password, rows[0].password)) return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            console.log("Password match");
            return done(null, rows[0]);
        });
    }));
}
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
    passport.serializeResident((resident, done) => {
        done(null, resident.id);
    });

    passport.deserializeResident((id, done) => {
        connection.query(`SELECT * FROM ${Tables.Residents} WHERE id = ?`, [id], (err, rows) => {
            done(err, rows[0]);
        });
    });

    passport.use('create-resident', 
        new LocalStrategy({ 
            lastnameField: 'lastname', 
            firstnameField: 'firstname', 
            roomnumberField: 'roomnumber', 
            phonenumberField: 'phonenumber',
            emailField: 'email' }, (req, lastnameField, firstnameField, roomnumber, phonenumber, email, done) => {
        connection.query(`SELECT * FROM ${Tables.Residents} WHERE roomnumber = ?`, [roomnumber], (err, rows) => {
            if (err) return done(err);
            if (rows.length) return done(null, flase, req.flash('createMessage', `Resident with room number ${roomnumber} already exists.`));
            else {
                var newResident = { lastname, firstname, roomnumber, phonenumber, email };
                var insertQuery = `INSERT INTO ${Tables.Residents} ( lastname, firstname, roomnumber, phonenumber, email) values ( ?, ?, ?, ?, ?)`;
                connection.query(insertQuery, [newResident.lastname, newResident.firstname, roomnumber.newResident, phonenumber.newResident, newResident.email], function (err, rows) {
                    if (err) throw err;
                    newResident.id = rows.insertId;
                    return done(null, newResident);
                });
            }
        });
    }));

    passport.use('get-residents', new LocalStrategy({}, (req, done) => {
        connection.query(`SELECT * FROM ${Tables.Residents}`, (err, rows) => {
            if (err) return done(err);
            if (!rows.length) return done(null, false, req.flash('loginMessage', 'No residents'));
            return done(null, rows);
        });
    }));
}
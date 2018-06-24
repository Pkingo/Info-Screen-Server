const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
    const timeStamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timeStamp }, config.secret);
}

exports.signin = function(req, res, enxt) {
    res.send({ token: tokenForUser(req.user) });
}

exports.signup = function(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    if(!email || !password) return res.status(422).send({ error: 'You must provide email and password'});

    user.findOne({ email }, (error, existingUser) => {
        if (error) return next(error);
        if (existingUser) return res.status(422).send({ error: 'Email is in use' });
        const user = new User({ email, password });
        user.save((error) => {
            if (error) return next(error);
            res.json({ token: tokenForUser(user) });
        });
    });
}
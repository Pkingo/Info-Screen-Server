const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String
});

userSchema.pre('save', next => {
    const user = this;
    bcrypt.genSalt(10, (error, salt) => {
        if (error) return next(error);
        bcrypt.hash(user.password, salt, null, (error, hash) => {
            if (error) return next(error);
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(condidatePassword, callback) {
    bcrypt.compare(condidatePassword, this.password, (error, isMatch) => {
        if (error) return callback(error);
    });
}

const ModelClass = mongoose.model('user', userSchema);
module.exports = ModelClass;
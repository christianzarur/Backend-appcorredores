'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    nombre: String,
    apellido: String,
    nick: String,
    email: String,
    password: String,
    rol: String,
    imagen: String
});

module.exports = mongoose.model('User', UserSchema);
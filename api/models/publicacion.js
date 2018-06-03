'use strict'

var moongose = require('mongoose');
var Schema = moongose.Schema;

var PublicacionSchema = Schema({
    texto: String,
    file: String,
    fecha: String,
    user: {type: Schema.ObjectId, ref: 'User'}

});

module.exports = moongose.model('Publicacion', PublicacionSchema);
'use strict'

var moongose = require('mongoose');
var Schema = moongose.Schema;

var MensajeSchema = Schema ({
    contenido: String,
    visto: String,
    fecha: String,
    emisor:{type: Schema.ObjectId, ref: 'User'},
    receptor:{type: Schema.ObjectId, ref: 'User'},
});

module.exports = moongose.model('Mensaje', MensajeSchema);
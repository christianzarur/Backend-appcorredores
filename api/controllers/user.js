'use strict'

var User = require('../models/user');

function home(req, res) {
    res.status(200).send({
        message: 'hola mundo desde el servidor nodejs'
    });
}

function pruebas(req, res) {
    res.status(200).send({
        message: 'accion de pruebas en el servidor nodejs'
    });
}

module.exports = {
    home,
    pruebas
}
'use strict'

var path = require('path');
var fs = require('fs');
var moment = require('moment');
var moongosePaginate = require('mongoose-pagination');

var Publication = require('../models/publicacion');
var User = require('../models/user');
var Follow = require ('../models/follow');

function probando(req, res) {
    res.status(200).send({message: "Desde el controlador de publicaciones"});
}


function savePublication(req, res) {
    var params = req.body;

    if (!params.texto) {
        res.status(200).send({message: "Debes enviar un texto"});
    }

    var publication = new Publication();
    publication.texto = params.texto;
    publication.file = 'null';
    publication.user = req.user.sub;
    publication.fecha = moment().unix();

    publication.save((err, publicationStored) => {
        if (err) {
            res.status(500).send({message: "Error al guardar la publicación"});
        }
        if (!publicationStored) {
            res.status(404).send({message: "La publicación no ha sido guardada"});
        }

        return res.status(200).send({publication: publicationStored});
    });
}

module.exports = {
    probando,
    savePublication
}
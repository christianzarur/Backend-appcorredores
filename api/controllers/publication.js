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

function getPublications(req, res) {
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 4;

    Follow.find({user: req.user.sub}).populate('seguido').exec((err, follows) => {
        if (err) res.status(500).send({message: "Error al devolver el seguimiento"});

        var follows_clean =[];

        follows.forEach((follow) => {
            follows_clean.push(follow.seguido);
        });
        Publication.find({user: {"$in": follows_clean}}).sort('-fecha').populate('user').paginate(page, itemsPerPage, (err, publications, total) =>{
            if (err) res.status(500).send({message: "Error al devolver publicaciones"});

            if (!publications) res.status(404).send({message: "No hay publicaciones"});

            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total/itemsPerPage),
                page: page,
                publications
            })
        });
    });
}


function getPublication(req, res) {
    var publicationId = req.params.id;

    Publication.findById(publicationId, (err, publication) => {
        if (err) res.status(500).send({message: "Error al devolver publicaciones"});

        if (!publication) res.status(404).send({message: "No existe la publicación"});

        return res.status(200).send({publication});
    });
}

function deletePublication(req, res) {
    var publicationId = req.params.id;

    Publication.find({'user': req.user.sub, '_id': publicationId}).remove(err =>{
        if (err) res.status(500).send({message: "Error al devolver publicaciones"});

        return res.status(200).send({message: 'Publicación eliminada correctamente'});
    });
}

module.exports = {
    probando,
    savePublication,
    getPublications,
    getPublication,
    deletePublication
}
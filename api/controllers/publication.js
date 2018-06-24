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

        follows_clean.push(req.user.sub);
        
        Publication.find({user: {"$in": follows_clean}}).sort('-fecha').populate('user').paginate(page, itemsPerPage, (err, publications, total) =>{
            if (err) res.status(500).send({message: "Error al devolver publicaciones"});

            if (!publications) res.status(404).send({message: "No hay publicaciones"});

            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total/itemsPerPage),
                page: page,
                items_per_page: itemsPerPage,
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

//SUBIR ARCHIVOS DE IMAGEN/AVATAR DE USUARIO

function uploadImagen(req, res) {
    var publicationId = req.params.id;


    if (req.files) {
        var file_path = req.files.image.path;
        console.log(file_path);

        var file_split = file_path.split('\\');
        console.log(file_split);

        var file_name = file_split[2];
        console.log(file_name);

        var ext_split = file_name.split('\.');
        console.log(ext_split);

        var file_ext = ext_split[1];
        console.log(file_ext);

        Publication.findOne({'user': req.user.sub, '_id': publicationId}).exec((err, publication) =>{
            if (publication) {
                 //actualizar documento de publicación
                 Publication.findByIdAndUpdate(publicationId, {file: file_name}, {new: true}, (err, publicationUpdated) => {
                     if (err) return res.status(500).send({message: 'No tienes permiso para actualizar los datos del usuario'});

                     if (!publicationUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'
                     });

                     return res.status(200).send({publication: publicationUpdated});
                 });
            }else{
                return removeFilesOfUploads(res, file_path, 'No tienes permiso para actualizar esta publicación')
            }
        });
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
           
        } else {
            return removeFilesOfUploads(res, file_path, 'Extension no valida')
        }
    } else {
        return res.status(200).send({
            message: 'No se han subido imagenes'
        });
    }
}

function removeFilesOfUploads(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        return res.status(200).send({
            message: message
        });
    });
}

function getImageFile(req, res) {
    var image_file = req.params.imageFile
    var path_file = './uploads/publications/' + image_file;

    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200.).send({
                message: 'No existe la imagen'
            });
        }
    });
}

function getPublicationsUser(req, res) {
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    var user = req.user.sub;
    if (req.params.user) {
        user = req.params.user;
    }

    var itemsPerPage = 4;
        Publication.find({user: user}).sort('-fecha').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
            if (err) res.status(500).send({
                message: "Error al devolver publicaciones"
            });

            if (!publications) res.status(404).send({
                message: "No hay publicaciones"
            });

            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total / itemsPerPage),
                page: page,
                items_per_page: itemsPerPage,
                publications
            })
        });
}

module.exports = {
    probando,
    savePublication,
    getPublications,
    getPublication,
    deletePublication,
    uploadImagen,
    getImageFile, 
    getPublicationsUser
}
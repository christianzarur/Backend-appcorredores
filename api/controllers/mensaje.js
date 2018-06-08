'use strict'

var moment = require('moment');
var moongosePaginate = require('mongoose-pagination'); 

var User = require('../models/user');
var Follow = require('../models/follow');
var Mensaje = require('../models/mensaje');

function probando(req, res) {
    res.status(200).send({message: 'Probando controlador de mensajes'});
}

function SaveMensaje(req, res) {
    var params = req.body;

    if(!params.contenido || !params.receptor){
        return res.status(200).send({message: 'Envias los datos necesarios'});
    }
     
    var mensaje = new Mensaje();
    mensaje.emisor = req.user.sub;
    mensaje.receptor = params.receptor;
    mensaje.contenido = params.contenido;
    mensaje.fecha = moment().unix();

    mensaje.save((err, mensajeStored) => {
        if (err) {
            return res.status(500).send({message: 'Error en la petición'});
        }
        if (!mensajeStored) {
            return res.status(500).send({message: 'Error al enviar el mensaje'});
        }

        return res.status(200).send({message: mensajeStored});
    });
}

function getReceivedMensajes(req, res) {
    var userId = req.user.sub;

    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }
    var itemsPerPage = 4;

    Mensaje.find({receptor: userId}).populate('emisor', 'nombre apellido imagen nick _id').paginate(page, itemsPerPage, (err, mensajes, total)=>{
        if (err) {
            return res.status(500).send({message: 'Error en la petición'});
        }
        if (!mensajes) {
            return res.status(404).send({message: 'No hay mensajes que mostrar'});
        }

        return res.status(200).send({
            total: total,
            pages: Math.ceil(total/itemsPerPage),
            mensajes
        });
    });
}

function getEmmitedMensajes(req, res) {
    var userId = req.user.sub;

    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    var itemsPerPage = 4;

    Mensaje.find({emisor: userId}).populate('emisor receptor', 'nombre apellido imagen nick _id').paginate(page, itemsPerPage, (err, mensajes, total) => {
        if (err) {
            return res.status(500).send({message: 'Error en la petición'});
        }
        if (!mensajes) {
            return res.status(404).send({message: 'No hay mensajes que mostrar'});
        }

        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsPerPage),
            mensajes
        });
    });
}

module.exports = {
    probando,
    SaveMensaje,
    getReceivedMensajes,
    getEmmitedMensajes
}
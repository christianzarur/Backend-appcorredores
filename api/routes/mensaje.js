'use strict'

var express = require('express');
var MensajeControler = require('../controllers/mensaje');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/probando-msj', md_auth.ensureAuth, MensajeControler.probando);
api.get('/mis-mensajes/:page?', md_auth.ensureAuth, MensajeControler.getReceivedMensajes);
api.get('/mensajes-enviados/:page?', md_auth.ensureAuth, MensajeControler.getEmmitedMensajes);

api.post('/mensaje', md_auth.ensureAuth, MensajeControler.SaveMensaje);

module.exports = api;
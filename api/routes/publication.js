'use strict'

var express = require('express');
var PublicactionController = require('../controllers/publication');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/publications'});

api.get('/probando-pub', md_auth.ensureAuth, PublicactionController.probando);
api.get('/publications/:page?', md_auth.ensureAuth, PublicactionController.getPublications);

api.post('/publication', md_auth.ensureAuth, PublicactionController.savePublication);

module.exports = api;
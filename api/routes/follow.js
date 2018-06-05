'use strict'

var express = require('express');
var FollowController = require ('../controllers/follow');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/follow', md_auth.ensureAuth, FollowController.saveFollow);

api.get('/following/:id?/:page?', md_auth.ensureAuth, FollowController.getFollowingUsers);
api.get('/followed/:id?/:page?', md_auth.ensureAuth, FollowController.getFollowedUsers);


api.delete('/follow/:id', md_auth.ensureAuth, FollowController.deleteFollow);


module.exports = api;
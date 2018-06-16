'use strict'
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');
var Follow = require('../models/follow');
var Publication = require('../models/publicacion')

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

//REGISTRO
function saveUser(req, res) {
    var params = req.body;
    var user = new User();

    if (params.nombre && params.apellido && params.nick && params.password){
        user.nombre = params.nombre;
        user.apellido = params.apellido;
        user.nick = params.nick;
        user.email = params.email;
        user.rol = 'ROL_USER';
        user.imagen = null;

        //CONTROLAR USUARIOS DUPLICADOS
        User.find({ $or: [
            {email: user.email.toLowerCase()},
            {nick: user.nick.toLowerCase()}
        ]}).exec((err, users)=> {
            if (err) return res.status(500).send({message: 'Error en la peticion de usuarios'});

            if (users && users.length >=1){
                return res.status(200).send({message: 'El usuario ya existe'});
            }
            else{
                //CIFRA CONTRASEÑA Y GUARDA LOS DATOS
                bcrypt.hash(params.password, null, null, (err, hash)=>{
                    user.password = hash;
                    user.save((err,userStored)=>{
                        if(err) return res.status(500).send({message: 'Error al guardar el usuario'});

                        if(userStored){
                            res.status(200).send({user: userStored});
                        }else{
                            res.status(404).send({message: 'No se ha registrado el usuario'});
                        }
                    });
                });
            }
        });
    }else{
                res.status(200).send({
                message: 'Envia todos los campos necesarios'
                })
            }
}

//LOGIN
function loginUser(req, res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({email: email}, (err,user)=> {
        if (err) return res.status(500).send ({message: 'Error en la peticion'});

        if (user){
            bcrypt.compare(password, user.password, (err, check) => {
                if (check){
                    if (params.gettoken) {
                        //GENERAR Y DEVOLVER TOKEN
                        return res.status(200).send({token: jwt.createToken(user)})
                    }else{
                    //DEVOLVER DATOS DEL USUARIO SIN MOSTRAR CONTRASEÑA
                    user.password = undefined;
                    return res.status(200).send({user});
                    }   
                }else{
                    return res.status(404).send({message: 'El usuario no se ha podido identificar'});
                }
            });
        }else{
             return res.status(404).send({message: 'El usuario no se ha podido identificar!!'});
        }
    });
}

//CONSEGUIR DATOS DE UN USUARIO
function getUser(req, res) {
    var userId = req.params.id;

    User.findById(userId, (err, user)=>{
        if (err) return res.status(500).send({message: 'Error en la peticion'});

        if (!user) return res.status(404).send({message: 'El usuario no existe'});

        followThisUser(req.user.sub, userId).then((value)=>{
            user.password = undefined;
            return res.status(200).send({
                user, 
                following: value.following,
                followed: value.followed});
        });
    });
}

async function followThisUser(identity_user_id, user_id) {
    try {
        var following = await Follow.findOne({user: identity_user_id,seguido: user_id}).exec().then((following) => {
                return following;
            })
            .catch((err) => {
                return handleError(err);
            });
        var followed = await Follow.findOne({user: user_id,seguido: identity_user_id}).exec().then((followed) => {
            return followed;
            })
            .catch((err) => {
            return handleError(err);
        });

        return {
            following: following,
            followed: followed
        }
    } catch (err) {
        return handleError(err);
    }
}

//DEVOLVER UN LISTADO DE USUARIOS REGISTRADOS
function getUsers(req, res) {
    var identity_user_id = req.user.sub;

    var page = 1;
    if(req.params.page){
        page =req.params.page;
    }
    var itemsPerPage = 5;

    User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) =>{
        if (err) return res.status(500).send({message: 'Error en la peticion'});

        if (!users) return res.status(404).send({message: 'No hay usuarios disponibles'});
        
        followUserIds(identity_user_id).then((value)=>{
            return res.status(200).send({
                users,
                users_following: value.following,
                users_follow_me: value.followed,
                total,
                pages: Math.ceil(total/itemsPerPage)
            });
        });
        
    });
}

async function followUserIds(user_id) {
    try {
        var following = await Follow.find({"user": user_id}).select({'_id': 0,'__v': 0,'user': 0}).exec().then((follows) => {
                return follows;
            })
            .catch((err) => {
                return handleError(err)
            });

        var followed = await Follow.find({"seguido": user_id}).select({'_id': 0,'__v': 0,'seguido': 0}).exec().then((follows) => {
                return follows;
            })
            .catch((err) => {
                return handleError(err)
            });

        //Procesar following Ids
        var following_clean = [];

        following.forEach((follow) => {
            following_clean.push(follow.seguido);
        });

        //Procesar followed Ids
        var followed_clean = [];

        followed.forEach((follow) => {
            followed_clean.push(follow.user);
        });
        return {
            following: following_clean,
            followed: followed_clean
        }

    } catch (e) {
        console.log(e);
    }
}

function getCounters(req, res) {
    var userId = req.user.sub;
    if (req.params.id) {
        userId = req.params.id;
    }
    getCountFollow(userId).then((value)=>{
        return res.status(200).send(value);
    });

}

async function getCountFollow(user_id) {
    try {
        var following = await Follow.count({"user": user_id}).exec().then(count => {
            return count;
        })
        .catch((err) => {
            return handleError(err);
        });

        var followed = await Follow.count({"seguido": user_id}).exec().then(count => {
            return count;
        })
        .catch((err) => {
            return handleError(err);
        });
        
        var publications = await Publication.count({"user": user_id}).exec().then(count =>{
            return count;
        })
        .catch((err) => {
            return handleError(err);
        });


        return {
            following: following,
            followed: followed,
            publications: publications
        }

    } catch (e) {
        console.log(e);
    }
}

//EDICION DE DATOS DE USUARIO
function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    //borrar propiedad password
    delete update.password;

    if (userId != req.user.sub){
        return res.status(500).send({message: 'No tienes permiso para actualizar los datos del usuario'});
    }
    User.find({$or: [
        {email: update.email.toLowerCase()},
        {nick: update.nick.toLowerCase()}
    ]}).exec((err, users) => {
        var user_isset = false;
        users.forEach((user)=>{
            if (user && user._id != userId) {
                user_isset = true;
            }
        })
            if(user_isset){
            return res.status(404).send({
                message: 'Los datos ya estan en uso'
                    });
        }
        User.findByIdAndUpdate(userId, update, {new:true} ,(err, userUpdated) => {
            if (err) return res.status(500).send({message: 'No tienes permiso para actualizar los datos del usuario'});

            if (!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});

            return res.status(200).send({user: userUpdated});
        });
    });
}

//SUBIR ARCHIVOS DE IMAGEN/AVATAR DE USUARIO

function uploadImagen(req, res) {
    var userId = req.params.id;

   
    if (req.files) {
        var file_path = req.files.imagen.path;
        console.log(file_path);

        var file_split = file_path.split('\\');
        console.log(file_split);

        var file_name = file_split[2];
        console.log(file_name);

        var ext_split = file_name.split('\.');
        console.log(ext_split);

        var file_ext = ext_split[1];
        console.log(file_ext);

        if(userId != req.user.sub){
            return removeFilesOfUploads(res, file_path, 'No tienes permiso para actualizar los datos del usuario');
        }
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext =='gif') {
            //actualizar documento de usuario logueado
            User.findByIdAndUpdate(userId,{imagen: file_name}, {new: true}, (err, userUpdated) =>{
               if (err) return res.status(500).send({ message: 'No tienes permiso para actualizar los datos del usuario'});

               if (!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                
               return res.status(200).send({user: userUpdated});
            });
        } else {
            return removeFilesOfUploads(res, file_path, 'Extension no valida')
        }
    }else{
        return res.status(200).send({message: 'No se han subido imagenes'});
    }
}

function removeFilesOfUploads (res, file_path, message){
    fs.unlink(file_path, (err) => {
        return res.status(200).send({message: message});
    });
}

function getImageFile(req, res) {
    var image_file = req.params.imageFile
    var path_file = './uploads/users/'+image_file;

    fs.exists(path_file, (exists) =>{
        if (exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200.).send({message: 'No existe la imagen'});
        }
    });
}

module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    getCounters,
    updateUser,
    uploadImagen,
    getImageFile
}
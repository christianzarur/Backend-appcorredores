'use strict'
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');
var mongoosePaginate = require('mongoose-pagination');

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

        return res.status(200).send({user});
    });
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

        return res.status(200).send({
            users,
            total,
            pages: Math.ceil(total/itemsPerPage)
        });
    });
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

    User.findByIdAndUpdate(userId, update, {new:true} ,(err, userUpdated) => {
        if (err) return res.status(500).send({message: 'No tienes permiso para actualizar los datos del usuario'});

        if (!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});

        return res.status(200).send({user: userUpdated});
    });
}

//SUBIR ARCHIVOS DE IMAGEN/AVATAR DE USUARIO

function uploadImagen(req, res) {
    var userId = req.params.id;

    if(userId != req.user.sub){
        return res.status(500).send({message: 'No tienes permiso para actualizar los datos del usuario'});
    }
    if (req.files) {
        var file_path = req.files.image.path;
        console.log(file_path);
        var file_split = file_path.file_split('\\');
    }
}

module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImagen
}
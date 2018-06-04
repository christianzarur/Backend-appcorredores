'use strict'
var bcrypt = require('bcrypt-nodejs');
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
                        }
                        else{
                            res.status(404).send({message: 'No se ha registrado el usuario'});
                        }
                    });
                });
            }
        });
    }
    else{
                res.status(200).send({
                message: 'Envia todos los campos necesarios'
                })
            }
}

function loginUser(req, res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({email: email}, (err,user)=> {
        if (err) return res.status(500).send ({message: 'Error en la peticion'});

        if (user){
            bcrypt.compare(password, user.password, (err, check) => {
                if (check){
                    //devolver datos de usuario
                    return res.status(200).send({user});
                }
                else{
                    return res.status(404).send({message: 'El usuario no se ha podido identificar'});
                }
            });
        }
        else{
             return res.status(404).send({message: 'El usuario no se ha podido identificar'});
        }
    });

}
module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser
}
'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;

//conexion db
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/mean_social', {useMongoClient: true})
        .then(()=>{
            console.log("La conexion a la base de datos fue exitosa");

            //crear servidor
            app.listen(port, () =>{
                console.log("servidor corriendo en http://localhost:3800");
            })
        })
        .catch(err => console.log(err));
const express = require('express');
const cors = require('cors');
require('dotenv').config();

//Crear el servidor/aplicacion de express
const app = express();

//Directorio publico
app.use(express.static('public'));

//CORS(middleware)
app.use( cors() )

//Lectura y parseo del body (middleware)
app.use( express.json() );

//Rutas(middleware)
app.use( '/api/auth', require('./routes/auth') );




app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puero ${4000}`)
})
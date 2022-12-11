const express = require('express');
const cors = require('cors');


//Crear el servidor/aplicacion de express
const app = express();

//CORS(middleware)
app.use( cors() )

//Lectura y parseo del body (middleware)
app.use( express.json() );

//Rutas(middleware)
app.use( '/api/auth', require('./routes/auth') );




app.listen(4000, () => {
    console.log(`Servidor corriendo en puero ${4000}`)
})
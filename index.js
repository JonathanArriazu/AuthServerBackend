const express = require('express');
const cors = require('cors');


//Crear el servidor/aplicacion de express
const app = express();

//CORS(middelware)
app.use(cors())

//Rutas(middelware)
app.use(  '/api/auth', require('./routes/auth') );




app.listen(4000, () => {
    console.log(`Servidor corriendo en puero ${4000}`)
})
const { response } = require('express');

const Usuario = require('../models/Usuario');

const crearUsuario = async (req, res) => { //Transformamos a funcion asincrona para trabajar con await

    /* const errors = validationResult( req );
    if( !errors.isEmpty() ) {
        return res.status(400).json({
            ok: false,
            errors: errors.mapped()
        })
    } */

    const { email, name, password } = req.body;

    try {

        // 1)VERIFICAR QUE NO EXISTA EL EMAIL
        const usuario = await Usuario.findOne({ email: email }); //findOne va a buscar alguien cuyo email sea 
        //igual al email que recibo como argumento

        //Esto va a devolver un objeto, entonces si es que devuelve algo, quiere decir que no puedo crear
        //un usuario con ese email porque el objeto ya existe
        if (usuario) {
            return response.status(400).json({
                ok: false,
                msg: 'El usuario ya existe con ese email'
            });
        }
        //una vez pasada esa verificacion, puedo seguir con el paso 2

        //2)CREAR USUARIO CON EL MODELO
        const dbUser = new Usuario( req.body ) //le envio al nuevo usuario la informacion que viene en el body (email, name y password)

        //3)Encriptar la contraseña (mediante un hash)

        //4)Generar el JasonWebToken(JWT)

        //5)CREAR USUARIO DE BASE DE DATOS
        await dbUser.save(); //Como save e suna funcion que va a la base de datos         
        //y luego responde, utilizo el await

        //Si la respuesta es exitosa entonces puedo seguir con el paso 6

        //6)Generar respuesta exitosa

        return res.status(201).json({
            ok: true,
            uid: dbUser.id, //Este id viene ya generado desde Mongo
            name
        });
        
    } catch (error) {
        console.log(error) //Mostramos el error en consola pero fuera del return, sino cualquier usuario podria verlo
        return res.status(500).json({ //status 500 porque si llega a este punto, algo internamente sucedio mal
            ok: false,
            msg: 'Algo salio mal, pongase en contacto con el administrador'
        })
    }
        
    /* return res.json({
        ok: true,
        msg: 'Crear usuario /new'
    }) */
}

const loginUsuario = (req, res = response) => {

    /* const errors = validationResult( req );
    if( !errors.isEmpty() ) {
        return res.status(400).json({
            ok: false,
            errors: errors.mapped()
        })
    } */

    const { email, password } = req.body;
    console.log(email, password);

    return res.json({
        ok: true,
        msg: 'Login de usuario /new'
    })
}

const revalidarToken = (req, res = response) => {

    return res.json({
        ok: true,
        msg: 'Renew'
    })

}



module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}
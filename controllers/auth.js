const { response } = require('express');

const Usuario = require('../models/Usuario');

const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

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
        const salt = bcrypt.genSaltSync(); //forma aleatoria de generar unos numeros
        //Encriptaremos tomando la contraseña de dbUser y modificando el password
        dbUser.password = bcrypt.hashSync( password, salt );

        //4)Generar el JasonWebToken(JWT)
        const token = await generarJWT( dbUser.id, dbUser.name )


        //5)CREAR USUARIO DE BASE DE DATOS
        await dbUser.save(); //Como save e suna funcion que va a la base de datos         
        //y luego responde, utilizo el await

        //Si la respuesta es exitosa entonces puedo seguir con el paso 6

        //6)Generar respuesta exitosa

        return res.status(201).json({
            ok: true,
            uid: dbUser.id, //Este id viene ya generado desde Mongo
            name,
            token
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

const loginUsuario = async(req, res = response) => {

    /* const errors = validationResult( req );
    if( !errors.isEmpty() ) {
        return res.status(400).json({
            ok: false,
            errors: errors.mapped()
        })
    } */

    const { email, password } = req.body;
    
    try {

        const dbUser= await Usuario.findOne({ email: email });
        if ( !dbUser ) { //Si no tenemos un dbUser, significa que el email es incorrecto
            return res.status(400).json({
                ok: false,
                msg: 'El correo no existe'
            })
        }

        //Si llega este punto significa que tenemos un usuario con email existente pero
        //aun no verificamos la contraseña, entonces ahora CONFIRMAMOS SI EL PASSWORD HACE MATCH

        //CompareSync sirve para saber si al encriptar una contraseña haria match con otra que ya tenemos encriptada
        const validPassword = bcrypt.compareSync( password, dbUser.password ) //true si son validos o false si no

        if( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'El password no es valido'
            })
        }

        //En este punto el email es valido y la contraseña tambien entonces generamos el JWT
        const token = await generarJWT( dbUser.id, dbUser.name )

        //Hacemos el retorno o respuesta del servicio
        return res.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            token
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
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
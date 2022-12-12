const jwt = require('jsonwebtoken');


const generarJWT = ( uid, name ) => {

    const payload = { uid, name };

    return new Promise( (resolve, reject) => {
        //sign pide: payload(info que yo quiero que sea grabada en mi JWT), 
        //secretOrPrivateKey (llave secreta que nadie debe conocer), otras opciones.
        jwt.sign(payload, process.env.SECRET_JWT_SEED, {
           expiresIn: '24h' //Para que expire en el tiempo indicado
        }, (error, token) => {

            if ( error ) {
                console.log(error);
                reject( error )
           } else {
                resolve( token )
           }
        })
    } )    

}

module.exports= {
    generarJWT
}
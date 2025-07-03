const config = require('../config')
const nodemailer = require('nodemailer')


const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: 465,
    secure: true,
    auth:{
        user: config.email.user,
        pass: config.email.password,
    }
})

async function enviarMailReestablecer(direccion, token){
    if (!direccion || typeof direccion !== 'string') {
    throw new Error("Dirección de correo inválida");
    }

    return await transporter.sendMail({
        from: "Dr. Juan Carlos Granados <noreply.redsaludlatam@gmail.com>",
        to: direccion,
        subject: "RedSaludLatam - Reestablecer contraseña",
        html: crearMailRecuperacion(token),
    })
}

function crearMailRecuperacion(token){
    return `
    <html lang="es">
    <head>
        <style>
            html{
            background-color: white;
            }
            body{
            max-width: 600px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: auto;
            background-color: rgb(229, 255, 246);
            padding: 40px;
            border-radius: 4px;
            margin-top: 10px;
            }
        </style>
    </head>
    <body>
        <h1>Reestablecer contraseña - RedSaludLatam.com</h1>
        <p>Si esta cuenta no fue creada por usted, desestime este correo.</p>
        <p></p>Para recuperar su cuenta, acceda a la siguiente liga: <a href="${config.host.client}/Reestablecer?token=${token}" target="_blank" rel="noopener noreferrer">haciendo click aquí</a>.<p></p>
        <p>Dr. Juan Carlos Granados.</p>    
    </body>
</html>`
}

async function enviarMailVerificacion(direccion, token){
    if (!direccion || typeof direccion !== 'string') {
    throw new Error("Dirección de correo inválida");
    }

    return await transporter.sendMail({
        from: "Dr. Juan Carlos Granados <noreply.redsaludlatam@gmail.com>",
        to: direccion,
        subject: "RedSaludLatam - ¡Estás a un paso de finalizar tu registro!",
        html: crearMailVerificacion(token),
    })
}

function crearMailVerificacion(token){
    return `
    <html lang="es">
    <head>
        <style>
            html{
            background-color: white;
            }
            body{
            max-width: 600px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: auto;
            background-color: rgb(229, 255, 246);
            padding: 40px;
            border-radius: 4px;
            margin-top: 10px;
            }
        </style>
    </head>
    <body>
        <h1>Verificación de correo electrónico - RedSaludLatam.com</h1>
        <p>Se ha creado una cuenta en RedSaludLatam con este correo electrónico.</p>
        <p>Si esta cuenta no fue creada por usted, desestime este correo.</p>
        <p></p>Si usted creó la cuenta, entonces verifique la cuenta <a href="${config.host.api}/api/usuarios/verificacion/${token}" target="_blank" rel="noopener noreferrer">haciendo click aquí</a>.<p></p>
        <p>Dr. Juan Carlos Granados.</p>    
    </body>
</html>`
}
 
module.exports = {
    enviarMailVerificacion,
    enviarMailReestablecer
};
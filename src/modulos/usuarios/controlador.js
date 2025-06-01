const TABLA = 'rsluser';
const auth = require('../auth');

module.exports = function (dbInyectada) {
    let db = dbInyectada || require('../../DB/mysql');

    async function todos(_, body) {
        if (!body.que) {
            throw new Error("Falta el campo 'que'");
        }

        const resultados = await db.query(TABLA, { experticia: body.que });

            // 2️⃣ Mapea cada registro y convierte el BLOB a Data-URL
            const usuariosConLogo = resultados.map(u => {
            let logoDataUrl = 'default.png';

            // Si u.logo es un Buffer real y tiene contenido…
            if (u.logo && Buffer.isBuffer(u.logo) && u.logo.length) {
            const base64    = u.logo.toString('base64');
            // Aquí asumo PNG; cámbialo a 'image/jpeg' si tu BLOB es JPG
            logoDataUrl     = `data:image/jpeg;base64,${base64}`;
            }

            return {
            ...u,
            logo: logoDataUrl
            };
        });

        return usuariosConLogo;
    }


    function uno(id) {
        return db.uno(TABLA, id);
    }

    function eliminar(body) {
        return db.eliminar(TABLA, body);
    }

    async function agregar(res, body) {
        const { usuario, correo, password, id = 0 } = body;

        // Validaciones
        if (usuario) {
            const existingUser = await db.query('rslauth', { usuario });
            if (existingUser.length !== 0) {
                return res.status(409).json({
                    code: 'USER_TAKEN',
                    message: 'Usuario ya existe, banda'
                });
            }
        }

        if (correo) {
            const existingEmail = await db.query('rslauth', { correo });
            if (existingEmail.length !== 0) {
                return res.status(409).json({
                    code: 'EMAIL_TAKEN',
                    message: 'Correo ya existe, banda'
                });
            }
        }

        const usuarioNuevo = {
            id,
            nombre: body.nombre,
            ciudad: body.ciudad,
            especialidad: body.especialidad,
            experticia: body.experticia,
            direccion: body.direccion,
            paginaweb: body.paginaweb,
            telefono: body.telefono,
            whatsapp: body.whatsapp,
            bio: body.bio,
            facebook: body.facebook,
            instagram: body.instagram,
            linkedin: body.linkedin,
            youtube: body.youtube,
            twitter: body.twitter,
            logo: body.logo,
            perfil: body.perfil,
        };

        const result = await db.agregar(TABLA, usuarioNuevo);
        const insertId = id || result.insertId;

        if (usuario || password || correo) {
            await auth.agregar({
                id: insertId,
                usuario,
                correo,
                password
            });
        }

        return { message: 'Usuario agregado exitosamente', id: insertId };
    }

    return {
        todos,
        uno,
        eliminar,
        agregar
    };
};

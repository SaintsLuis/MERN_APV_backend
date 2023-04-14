/** middleware es una función que se ejecuta entre la recepción de una solicitud HTTP y la respuesta a dicha solicitud. El middleware checkAuth es un middleware de autenticación que verifica si la solicitud HTTP contiene un token de autenticación válido en su encabezado Authorization. Si el token es válido, el middleware agrega el objeto veterinario  */

import jwt from 'jsonwebtoken'; // Importación del paquete jwt
import Veterinario from '../models/Veterinario.js'; // Importación del modelo de datos

const checkAuth = async (req, res, next) => {
    // Middleware que verifica la autenticación
    let token; // Variable para almacenar el token

    // Verifica si el token se encuentra en los headers y comienza con "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]; // Obtiene el token del header

            const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica y decodifica el token

            // Obtiene el usuario autenticado a partir del id decodificado
            req.veterinario = await Veterinario.findById(decoded.id).select('-password -token -confirmado');
            return next(); // Continua con la siguiente función middleware
        } catch (error) {
            const e = new Error('Token no Valido');
            return res.status(403).json({ msg: e.message }); // Devuelve un error si el token no es válido
        }
    }

    // Si no se encontró el token en los headers
    if (!token) {
        const error = new Error('Token no Valido o Inexistente');
        res.status(403).json({ msg: error.message }); // Devuelve un error si el token no existe
    }

    next(); // Continua con la siguiente función middleware
};

export default checkAuth; // Exportación del middleware```
